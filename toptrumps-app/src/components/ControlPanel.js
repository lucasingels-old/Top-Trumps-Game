import React from "react";
import Button from "../common/Button";
import {STATUS_READY, STATUS_OVER} from "../constants/constants";

import history from "../utils/history";

const ControlPanel = props => {
  const {status, isPlayEnabled, handleButtonClick} = props;

  let buttonLabel;
  switch (status) {
    case STATUS_READY:
      buttonLabel = "Play";
      break;
    case STATUS_OVER:
      buttonLabel = "New Game";
      break;
    default:
      buttonLabel = "Continue";
  }

  return (
    <div className="control-panel">
      <Button
        buttonClassName={status === STATUS_READY ? "green" : "orange"}
        buttonOnClick={handleButtonClick}
        buttonLabel={buttonLabel}
        buttonIsDisabled={!isPlayEnabled}
      />
    </div>
  );
};

export default ControlPanel;
