import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Button from 'react-bootstrap/Button';
import GoogleButton from 'react-google-button';

import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { withFirebase } from '../../firebase/context';
import history from '../../utils/history';

const Login = () => (
  <div class="login">
      <h1>Login Page</h1>
        <SignInForm />
        <SignInGoogle />
        <PasswordForgetLink />
        <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push('/');
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (

      <div class="details">

      <form onSubmit={this.onSubmit}>
      <li class="not_list">
        <input class="email"
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
      </li>
      <br></br>
        <li class="not_list">
        <input class="password"
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        </li>

        <Button disabled={isInvalid} type="submit">
          Sign In
        </Button>

        {error && <p>{error.message}</p>}
      </form>

    </div>
    );
  }
}

class SignInGoogleBase extends Component {
  class="googlesign"
  constructor(props) {
    super(props);

    this.state = { error: null };
  }


  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
        });
      })
      .then(() => {
        this.setState({ error: null });
        history.push('/');
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

// Code to sign in with google
// */ google button doesn't take you to sign in with gooogle
    return (
      <div class="googlesign">
      <form onSubmit={this.onSubmit}>
        <Button type="submit">Sign In with Google</Button>
        {error && <p>{error.message}</p>}
      </form>
    </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);

export default Login;

export { SignInForm, SignInGoogle };
