import React from "react";

const ScorePanel = ({player1Score, player2Score}) => (
  <div className="score-panel">
    <div className="player-scores">
      <div>
        <span className="player-score">{player1Score}</span>
      </div>
      <div>
        <span className="player-score">{player2Score}</span>
      </div>
    </div>
  </div>
);

export default ScorePanel;
