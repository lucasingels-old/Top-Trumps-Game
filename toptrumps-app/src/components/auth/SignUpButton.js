import React from "react";
import Button from "react-bootstrap/Button";

import history from "../../utils/history";
import {withFirebase} from "../../firebase/context";

const SignUpButton = ({firebase}) => (
  <Button
    onClick={() => history.push("/signup")}
    variant="primary"
    className="navbar-button"
  >
    Sign Up
  </Button>
);

export default withFirebase(SignUpButton);
