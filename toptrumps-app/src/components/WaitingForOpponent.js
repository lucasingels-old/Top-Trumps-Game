import Button from "../common/Button";
import React from "react";
import {Row, Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";

import logo from "../images/Logo.png";
import history from "../utils/history";

const WaitingForOpponent = props => {
  const {
    handleButtonClickNewGame,
    handleButtonClickNoNewGame,
    finalWinner
  } = props;

  return (
    <div className="rules">
      <div>
        <h1 className="h1">{finalWinner} WINS!</h1>
        <h1 className="continue_message">Would you like to play again?</h1>
        <Button
          buttonClassName={"green"}
          buttonOnClick={handleButtonClickNewGame}
          buttonLabel={"Yes"}
          buttonIsDisabled={false}
        />
        <Button
          buttonClassName={"red"}
          buttonOnClick={handleButtonClickNoNewGame}
          buttonLabel={"No"}
          buttonIsDisabled={false}
        />
      </div>
    </div>
  );
};

export default WaitingForOpponent;
