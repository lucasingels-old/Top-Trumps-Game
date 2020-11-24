import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import {Row, Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";

import AuthUserContext from "../../firebase/session/context";
import {withFirebase} from "../../firebase/context";
import RoomList from "./RoomList";
import history from "../../utils/history";

class Rooms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomTitle: "",
      loading: false,
      rooms: [],
      maxCapacity: 2
    };
  }

  componentDidMount() {
    this.onListenForRooms();
  }

  onListenForRooms = () => {
    this.setState({loading: true});

    this.props.firebase
      .rooms()
      .orderByChild("createdAt")
      .on("value", snapshot => {
        const roomObject = snapshot.val();

        if (roomObject) {
          const roomList = Object.keys(roomObject).map(key => ({
            ...roomObject[key],
            uid: key
          }));

          this.setState({
            rooms: roomList,
            loading: false
          });
        } else {
          this.setState({
            rooms: null,
            loading: false
          });
        }
      });
  };

  componentWillUnmount() {
    this.props.firebase.rooms().off();
  }

  onChangeRoomTitle = event => {
    this.setState({roomTitle: event.target.value});
  };

  /*
    If the user doesnt already own another active room it will create one and add it
    to the global room list. If the user owns an active room they will be shown
    an error message.

    This method is used in the render component of this class.
  */
  onCreateRoom = (event, authUser) => {
    var newGame = this.props.firebase.games().push();
    var newRoom = this.props.firebase.rooms().push();

    this.props.firebase.user(authUser.uid).update({
      roomUID: newRoom.key,
      gameUID: newGame.key
    });

    newRoom.set({
      roomTitle: this.state.roomTitle,
      ownerUID: authUser.uid,
      gameUID: newGame.key,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
      members: 1,
      active: true
    });

    //Create new game and link it to this room
    newGame.set({
      active: true,
      roomUID: newRoom.key,
      createdAt: this.props.firebase.serverValue.TIMESTAMP
    });

    this.setState({
      roomTitle: ""
    });

    history.push("game/multiplayer");
  };

  /*
    If the room isnt full it will add  the user and they will
    need to wait for another user to enter. Else if the room reaches capacity it
    will send a signal to firebase to activate the game and the room members
    will be redirected to the game board.

    This method is passed down through the RoomList class into the RoomItem
    class
  */
  onJoinRoom = (room, authUser) => {
    const {uid, ...roomSnapshot} = room;

    this.props.firebase.user(authUser.uid).update({
      roomUID: room.uid,
      gameUID: room.gameUID
    });

    //Update the room information after second player clicks join
    this.props.firebase.room(room.uid).set({
      ...roomSnapshot,
      player2UID: authUser.uid,
      members: 2
    });

    history.push("game/multiplayer");
  };

  render() {
    const {roomTitle, rooms, loading} = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div className="rooms">
            <h1 className="room_header">Game Rooms</h1>

            {loading && <div>Loading ...</div>}

            {rooms && (
              <RoomList
                authUser={authUser}
                rooms={rooms}
                onJoinRoom={this.onJoinRoom}
              />
            )}

            {!rooms && <div>There are no rooms ...</div>}

            <form
              className="rooms_forms"
              onSubmit={event => this.onCreateRoom(event, authUser)}
            >
              <input
                name="room_field"
                type="text"
                value={roomTitle}
                onChange={this.onChangeRoomTitle}
              />

              <Button type="submit">Create Room</Button>
            </form>

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
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Rooms);
