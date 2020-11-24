import React from "react";
import CardContainer from "./card/CardContainer";
import {
  STATUS_READY,
  STATUS_OVER,
  PLAYER_1,
  PLAYER_2
} from "../constants/constants";

const GamePanel = props => {
  const {
    player1Card,
    player2Card,
    status,
    handleFeatureSelection,
    selectedFeature,
    lastWinner,
    isDraw,
    isOwner
  } = props;

  return (
    <div className="game-panel">
      {status === STATUS_OVER && (
        <div className="game-panel-result">Game Over</div>
      )}
      {isDraw && <div className="game-panel-result">Draw</div>}
      <CardContainer
        card={player1Card}
        isClosed={status === STATUS_READY && !isOwner}
        handleFeatureSelection={handleFeatureSelection}
        selectedFeature={selectedFeature}
        status={status}
        isActivePlayer={
          status === STATUS_READY && lastWinner === PLAYER_1 && isOwner
        }
        isWinner={status !== STATUS_READY && lastWinner === PLAYER_1 && !isDraw}
      />
      <div className="game-panel-x">VS</div>
      <CardContainer
        card={player2Card}
        isClosed={status === STATUS_READY && isOwner}
        handleFeatureSelection={handleFeatureSelection}
        selectedFeature={selectedFeature}
        status={status}
        isActivePlayer={
          status === STATUS_READY && lastWinner === PLAYER_2 && !isOwner
        }
        isWinner={status !== STATUS_READY && lastWinner === PLAYER_2 && !isDraw}
      />
    </div>
  );
};

export default GamePanel;
