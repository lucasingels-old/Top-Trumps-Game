import React from "react";
import Button from "react-bootstrap/Button";

import history from "../../utils/history";
import {withFirebase} from "../../firebase/context";

const LoginButton = ({firebase}) => (
  <div class="login_button">
    <Button
      onClick={() => history.push("/login")}
      variant="primary"
      className="navbar-button"
    >
      Login
    </Button>
  </div>
);

export default withFirebase(LoginButton);
