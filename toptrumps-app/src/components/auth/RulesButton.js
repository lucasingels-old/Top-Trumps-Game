import React from "react";
import Button from "react-bootstrap/Button";

import history from "../../utils/history";

const RulesButton = () => (
  <Button
    onClick={() => history.push("/rules")}
    variant="primary"
    className="profile-button"
  >
    Rules
  </Button>
);

export default RulesButton;
