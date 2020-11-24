import React, {Component} from "react";
import Button from "react-bootstrap/Button";

class RoomItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {authUser, room, onJoinRoom} = this.props;

    return (
      <div>
        {room.members != 2 && (
          <div>
            <li>
              <span className="room_item">
                Game:
                <strong>{room.roomTitle}</strong> {room.participants}
                {room.isFull && <span>(Full)</span>}
              </span>

              {authUser.uid != room.ownerUID && (
                <span>
                  <Button onClick={() => onJoinRoom(room, authUser)}>
                    Join
                  </Button>
                </span>
              )}
            </li>
          </div>
        )}
      </div>
    );
  }
}

export default RoomItem;
