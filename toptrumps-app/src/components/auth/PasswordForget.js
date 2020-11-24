import React, {Component} from "react";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

import Loading from "../Loading";
import {withFirebase} from "../../firebase/context";
import history from "../../utils/history";

const PasswordForget = () => (
  <div className="password_forget">
    <h1 className="password_head">Forgot Password?</h1>
    <p className="password_hint">
      {" "}
      Fill in your email address and we'll send you an email to reset your
      password.{" "}
    </p>
    <PasswordForgetForm />
  </div>
);

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      error: null,
      loading: false
    };
  }

  onSubmit = event => {
    const {email} = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({
          email: "",
          error: null,
          loading: true
        });
        history.push("/");
      })
      .catch(error => {
        this.setState({error});
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  render() {
    const {email, error, loading} = this.state;

    const isInvalid = email === "";

    return (
      <div className="password_details">
        {loading && <Loading />}

        {!loading && (
          <form onSubmit={this.onSubmit}>
            <input
              className="password_email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
            <Button disabled={isInvalid} type="submit">
              Reset My Password
            </Button>

            {error && <p>{error.message}</p>}
          </form>
        )}
      </div>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={"forgotpassword"}>Forgot Password?</Link>
  </p>
);

export default PasswordForget;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export {PasswordForgetForm, PasswordForgetLink};
