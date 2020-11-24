import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {compose} from "recompose";
import Button from "react-bootstrap/Button";

import {withFirebase} from "../../firebase/context";
import history from "../../utils/history";

const SignUp = () => (
  <div class="sign_up">
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {...INITIAL_STATE};
  }

  onSubmit = event => {
    const {username, email, passwordOne} = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({...INITIAL_STATE});
        history.push("/");
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({error});
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  onChangeCheckbox = event => {
    this.setState({[event.target.name]: event.target.checked});
  };

  render() {
    const {username, email, passwordOne, passwordTwo, error} = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    return (
      <div class="message_list">
        <form onSubmit={this.onSubmit}>
          <li class="not_list">
            <input
              class="text_field"
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="Full Name"
            />
          </li>
          <br></br>
          <li class="not_list">
            <input
              class="text_field"
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
          </li>
          <br></br>
          <li class="not_list">
            <input
              class="text_field"
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
          </li>
          <br></br>
          <li class="not_list">
            <input
              class="text_field"
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password"
            />
          </li>
          <div class="sign_up_button">
            <Button disabled={isInvalid} type="submit">
              Sign Up
            </Button>
          </div>

          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={"/signup"}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUp;

export {SignUpForm, SignUpLink};
