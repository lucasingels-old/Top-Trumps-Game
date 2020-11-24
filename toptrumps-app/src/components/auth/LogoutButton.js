import React from "react";
import Button from "react-bootstrap/Button";

import {withFirebase} from "../../firebase/context";

const LogoutButton = ({firebase}) => (
  <Button onClick={firebase.doSignOut} variant="danger">
    Logout
  </Button>
);

export default withFirebase(LogoutButton);
