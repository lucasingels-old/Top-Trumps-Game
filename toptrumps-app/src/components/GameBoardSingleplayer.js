import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import {Row, Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import ScorePanel from "./ScorePanel";
import GamePanel from "./GamePanelSingleplayer";
import ControlPanel from "./ControlPanel";

import history from "../utils/history";
import shuffleArray from "../utils/shuffleArray";
import soccerplayersData from "../assets/data/soccerplayers.json";
import {
  STATUS_READY,
  STATUS_DONE,
  STATUS_OVER,
  PLAYER_1,
  PLAYER_2
} from "../constants/constants";

var soccerplayers = shuffleArray(soccerplayersData.soccerplayers);
var halfLength = Math.ceil(soccerplayers.length / 2);

class GameBoardBot extends Component {
  componentWillMount() {
    this.setUpGame();
  }

  setUpGame() {
    this.setState({
      status: STATUS_READY,
      lastWinner: undefined,
      deck1: soccerplayers.slice(0, halfLength),
      deck2: soccerplayers.slice(halfLength),
      selectedFeature: undefined,
      isDraw: false
    });
  }

  resetGame() {
    soccerplayers = shuffleArray(soccerplayersData.soccerplayers);
    halfLength = Math.ceil(soccerplayers.length / 2);

    this.setState({
      status: STATUS_READY,
      lastWinner: undefined,
      deck1: soccerplayers.slice(0, halfLength),
      deck2: soccerplayers.slice(halfLength),
      selectedFeature: undefined,
      isDraw: false
    });
  }

  handleFeatureSelection = featureKey => {
    this.setState({
      selectedFeature: featureKey
    });
  };

  handleButtonClick = () => {
    const card1 = this.state.deck1[0];
    const card2 = this.state.deck2[0];
    switch (this.state.status) {
      case STATUS_OVER:
        this.resetGame();
        break;
      case STATUS_READY:
        this.handlePlay(card1, card2);
        break;
      default:
        this.handleContinue(card1, card2);
    }
  };

  willGameEnd() {
    return (
      !this.state.isDraw &&
      ((this.state.lastWinner === PLAYER_1 && this.state.deck2.length === 1) ||
        (this.state.lastWinner === PLAYER_2 && this.state.deck1.length === 1))
    );
  }

  handlePlay = (card1, card2) => {
    const feature1 = parseInt(card1[this.state.selectedFeature], 10);
    const feature2 = parseInt(card2[this.state.selectedFeature], 10);
    const newState = {};

    if (card1.topTrump || feature1 > feature2) {
      newState.lastWinner = PLAYER_1;
    } else if (card2.topTrump || feature1 < feature2) {
      newState.lastWinner = PLAYER_2;
    } else {
      newState.isDraw = true;
    }

    newState.status = this.willGameEnd() ? STATUS_OVER : STATUS_DONE;
    this.setState(newState);
  };

  handleContinue = (card1, card2) => {
    const {deck1, deck2, lastWinner, isDraw} = this.state;

    const newState = {
      status: STATUS_READY,
      selectedFeature: undefined,
      isDraw: false
    };

    if (isDraw) {
      newState.deck1 = [...deck1.slice(1), card1];
      newState.deck2 = [...deck2.slice(1), card2];
    } else {
      newState.deck1 = [
        ...deck1.slice(1),
        ...(lastWinner === PLAYER_1 ? [card1, card2] : [])
      ];
      newState.deck2 = [
        ...deck2.slice(1),
        ...(lastWinner === PLAYER_2 ? [card1, card2] : [])
      ];
    }

    this.setState(newState);
  };

  render() {
    const {
      deck1,
      deck2,
      status,
      selectedFeature,
      lastWinner,
      isDraw
    } = this.state;

    return (
      <div className="top-trumps">
        <ScorePanel player1Score={deck1.length} player2Score={deck2.length} />
        <GamePanel
          player1Card={deck1[0]}
          player2Card={deck2[0]}
          selectedFeature={selectedFeature}
          status={status}
          handleFeatureSelection={this.handleFeatureSelection}
          lastWinner={lastWinner}
          isDraw={isDraw}
        />
        <ControlPanel
          status={status}
          isPlayEnabled={!!selectedFeature}
          handleButtonClick={this.handleButtonClick}
        />

        <Container>
          <Col>
            <Row className="leave_button">
              <Button
                variant="outline-warning"
                onClick={() => history.push("/")}
                disabled={false}
              >
                Leave
              </Button>
            </Row>
          </Col>
        </Container>
      </div>
    );
  }
}

export default GameBoardBot;
