import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import {Row, Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";

import ScorePanel from "./ScorePanel";
import GamePanel from "./GamePanel";
import ControlPanel from "./ControlPanel";
import Loading from "./Loading";
import WaitingForOpponent from "./WaitingForOpponent";
import AuthUserContext from "../firebase/session/context";
import {withFirebase} from "../firebase/context";
import history from "../utils/history";
import shuffleArray from "../utils/shuffleArray";
import soccerplayersData from "../assets/data/soccerplayers.json";
import {
  STATUS_READY,
  STATUS_DONE,
  STATUS_OVER,
  STATUS_NEW_GAME,
  STATUS_NO_NEW_GAME,
  PLAYER_1,
  PLAYER_2
} from "../constants/constants";

const soccerplayers = shuffleArray(soccerplayersData.soccerplayers);
const halfLength = Math.ceil(soccerplayers.length / 2);
var userUID = "";
var roomUID = "";
var gameUID = "";
var ownerUID = "";
var drawStackCount = 0;
var drawDeckArray = [];

class GameBoardMP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deck1: [],
      deck2: [],
      status: "",
      selectedFeature: "",
      lastWinner: PLAYER_1,
      isDraw: false,
      loading: true
    };
  }

  componentDidMount() {
    this.setUpGame();
  }

  setUpGame = async () => {
    let authUser = this.context;
    userUID = authUser.uid;

    await this.props.firebase.user(userUID).once("value", snapshot => {
      roomUID = snapshot.val().roomUID;
      gameUID = snapshot.val().gameUID;
    });

    await this.props.firebase.room(roomUID).once("value", snapshot => {
      ownerUID = snapshot.val().ownerUID;
    });

    //Push the game state to the firebase database
    if (ownerUID == userUID && userUID != "") {
      var deckOne = soccerplayers.slice(0, halfLength);
      var deckTwo = soccerplayers.slice(halfLength);

      this.setState({
        status: STATUS_READY,
        lastWinner: PLAYER_1,
        deck1: deckOne,
        deck2: deckTwo,
        isOwner: true,
        loading: false
      });

      this.props.firebase.game(gameUID).update({
        status: STATUS_READY,
        lastWinner: PLAYER_1,
        deck1: deckOne,
        deck2: deckTwo,
        requestContinue: false,
        selectedFeature: "",
        selectedFeatureOpponent: "",
        statusFinal: ""
      });

      //Listeners for Owner
      this.onListenForOpponentFeatureSelection();
      this.onListenForContinue();
      this.onListenForFinalGameState();

      // Pull the game state from the firebase database
    } else if (userUID != "") {
      await this.props.firebase.game(gameUID).on("value", snapshot => {
        this.setState({
          status: snapshot.val().status,
          lastWinner: snapshot.val().lastWinner,
          finalWinner: snapshot.val().finalWinner,
          deck1: snapshot.val().deck1,
          deck2: snapshot.val().deck2,
          selectedFeature: snapshot.val().selectedFeature,
          selectedFeatureOpponent: snapshot.val().selectedFeatureOpponent,
          isDraw: snapshot.val().isDraw,
          isOwner: false,
          loading: false
        });
      });

      //This needs to be an await as the listener will be activated next which
      //might cause an unnecessary and error prone fire of the listener if the
      //promise is not fulfilled yet

      //Listeners for opponent
      this.onListenForOwnerFeatureSelection();
      this.onListenForFinalGameState();
    }
  };

  //Move comes in from opponent
  onListenForOpponentFeatureSelection = () => {
    this.props.firebase
      .game(gameUID + "/selectedFeatureOpponent")
      .on("value", snapshot => {
        if (snapshot.val() != "") {
          this.setState({
            selectedFeature: snapshot.val()
          });
          this.handlePlayOwner(this.state.deck1[0], this.state.deck2[0]);
        }
      });
  };

  //Updates opponent screen with owner feature selection
  onListenForOwnerFeatureSelection = () => {
    this.props.firebase
      .game(gameUID + "/selectedFeature")
      .on("value", snapshot => {
        if (snapshot.val() != "") {
          this.setState({
            status: STATUS_DONE,
            selectedFeature: snapshot.val()
          });
        }
      });
  };

  //Continue request comes in from opponent
  onListenForContinue = () => {
    this.props.firebase
      .game(gameUID + "/requestContinue")
      .on("value", snapshot => {
        if (snapshot.val() == true) {
          this.setState({
            status: STATUS_DONE
          });
          this.handleButtonClick();
        }
      });
  };

  //Determines what to do when the WaitingForOpponent screen is up
  onListenForFinalGameState = () => {
    this.props.firebase.game(gameUID + "/statusFinal").on("value", snapshot => {
      if (snapshot.val() === STATUS_NEW_GAME) {
        history.push("/game/multiplayer");
      } else if (snapshot.val() === STATUS_NO_NEW_GAME) {
        history.push("/");
      }
    });
  };

  componentWillUnmount() {
    //Switch off all listeners
    this.props.firebase.game(gameUID + "/selectedFeatureOpponent").off();
    this.props.firebase.game(gameUID + "/selectedFeature").off();
    this.props.firebase.game(gameUID + "/requestContinue").off();
    this.props.firebase.game(gameUID + "/statusFinal").off();
    this.props.firebase.game(gameUID).off();
  }

  // When a feature is selected locally it updates the state and sends this
  // change to the current game document in the databse.
  handleFeatureSelection = featureKey => {
    this.setState({
      selectedFeature: featureKey
    });
  };

  handleButtonClick = () => {
    const card1 = this.state.deck1[0];
    const card2 = this.state.deck2[0];

    //Actions to run if the button is pressed by the room owner
    if (this.state.isOwner) {
      switch (this.state.status) {
        case STATUS_OVER:
          //Handled by conditional rendering
          break;
        case STATUS_READY:
          this.handlePlayOwner(card1, card2);
          break;
        default:
          this.handleContinueOwner(card1, card2);
          this.props.firebase.game(gameUID).update({
            requestContinue: false
          });
      }
      // Actions to run if the button is pressed by opponent
    } else {
      switch (this.state.status) {
        case STATUS_OVER:
          //Handled by conditional rendering
          break;
        case STATUS_READY:
          this.handlePlayOpponent();
          break;
        default:
          this.handleContinueOpponent();
      }
    }
  };

  //Starts a new game with the people in the room
  handleButtonClickNewGame = () => {
    this.props.firebase.game(gameUID).update({
      statusFinal: STATUS_NEW_GAME
    });
    history.push("/game/multiplayer");
  };

  //Makes both players leave the game and go home
  handleButtonClickNoNewGame = () => {
    this.props.firebase.game(gameUID).update({
      statusFinal: STATUS_NO_NEW_GAME
    });
    history.push("/");
  };

  //Determines if the game is over based on the current state of the deck
  willGameEnd(lastWinner) {
    return (
      !this.state.isDraw &&
      ((lastWinner === PLAYER_1 && this.state.deck2.length === 1) ||
        (lastWinner === PLAYER_2 && this.state.deck1.length === 1))
    );
  }

  handlePlayOwner = (card1, card2) => {
    const feature1 = parseInt(card1[this.state.selectedFeature], 10);
    const feature2 = parseInt(card2[this.state.selectedFeature], 10);
    const newState = {};

    //Determines the winner
    newState.lastWinner = this.state.lastWinner;
    newState.isDraw = false;
    if (card1.topTrump || feature1 > feature2) {
      newState.lastWinner = PLAYER_1;
      newState.finalWinner = "PLAYER 1";
    } else if (card2.topTrump || feature1 < feature2) {
      newState.lastWinner = PLAYER_2;
      newState.finalWinner = "PLAYER 2";
    } else {
      newState.finalWinner = "";
      newState.isDraw = true;
    }

    newState.status = this.willGameEnd(newState.lastWinner)
      ? STATUS_OVER
      : STATUS_DONE;

    //Sends new state to firebase to tell opponent outcome of this play.
    this.props.firebase.game(gameUID).update({
      status: newState.status,
      lastWinner: newState.lastWinner,
      isDraw: newState.isDraw,
      selectedFeature: this.state.selectedFeature,
      finalWinner: newState.finalWinner
    });
    //Updates local screen with outcome of this play
    this.setState(newState);
  };

  //Triggers listener on owner side to handle feature selection
  handlePlayOpponent = () => {
    this.props.firebase.game(gameUID).update({
      selectedFeatureOpponent: this.state.selectedFeature
    });
  };

  handleContinueOwner = (card1, card2) => {
    const {deck1, deck2, lastWinner, isDraw} = this.state;

    const newState = {
      status: STATUS_READY,
      selectedFeature: "",
      selectedFeatureOpponent: "",
      isDraw: false
    };

    if (isDraw) {
      //Store the two cards in drawDeck and then send it to firebase
      drawDeckArray.push(card1);
      drawDeckArray.push(card2);

      //Take the two drawn cards away from the players
      newState.deck1 = deck1.slice(1);
      newState.deck2 = deck2.slice(1);
    } else {
      newState.deck1 = [
        ...deck1.slice(1),
        ...(lastWinner === PLAYER_1 ? [card1, card2] : [])
      ];
      newState.deck2 = [
        ...deck2.slice(1),
        ...(lastWinner === PLAYER_2 ? [card1, card2] : [])
      ];

      //When a player has won this will check if they will also receive any draw
      //cards
      if (drawDeckArray.length > 0) {
        if (lastWinner === PLAYER_1) {
          newState.deck1 = newState.deck1.concat(drawDeckArray);
        }
        if (lastWinner === PLAYER_2) {
          newState.deck2 = newState.deck2.concat(drawDeckArray);
        }
        drawDeckArray = [];
      }
    }

    this.setState(newState);

    //Sends new decks to firebase
    this.props.firebase.game(gameUID).update({
      status: STATUS_READY,
      selectedFeature: "",
      selectedFeatureOpponent: "",
      deck1: newState.deck1,
      deck2: newState.deck2,
      isDraw: false
    });
  };

  //Triggers continue on the owners side
  handleContinueOpponent = () => {
    this.props.firebase.game(gameUID).update({
      requestContinue: true
    });

    const newState = {
      status: STATUS_READY,
      selectedFeature: "",
      selectedFeatureOpponent: "",
      isDraw: false
    };

    this.setState(newState);
  };

  render() {
    const {
      deck1,
      deck2,
      status,
      selectedFeature,
      lastWinner,
      isDraw,
      isOwner,
      loading,
      finalWinner
    } = this.state;

    return (
      <div>
        {loading && <Loading />}

        {!loading && status !== STATUS_OVER && (
          <div className="top-trumps">
            <ScorePanel
              player1Score={deck1.length}
              player2Score={deck2.length}
            />
            <GamePanel
              player1Card={deck1[0]}
              player2Card={deck2[0]}
              selectedFeature={selectedFeature}
              status={status}
              handleFeatureSelection={this.handleFeatureSelection}
              lastWinner={lastWinner}
              isDraw={isDraw}
              isOwner={isOwner}
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
                    onClick={this.handleButtonClickNoNewGame}
                    disabled={false}
                  >
                    Leave
                  </Button>
                </Row>
              </Col>
            </Container>
          </div>
        )}

        {status === STATUS_OVER && (
          <WaitingForOpponent
            handleButtonClickNewGame={this.handleButtonClickNewGame}
            handleButtonClickNoNewGame={this.handleButtonClickNoNewGame}
            finalWinner={finalWinner}
          />
        )}
      </div>
    );
  }
}

GameBoardMP.contextType = AuthUserContext;

export default withFirebase(GameBoardMP);
