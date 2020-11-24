import React from "react";
import Button from "react-bootstrap/Button";

import history from "../../utils/history";

const ProfileButton = () => (
  <Button
    onClick={() => history.push("/profile")}
    variant="primary"
    className="profile-button"
  >
    Profile
  </Button>
);

export default ProfileButton;
