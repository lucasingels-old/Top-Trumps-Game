import React, {Component} from "react";
import MessageList from "./MessageList";
import Messages from "./Messages";
import Button from "react-bootstrap/Button";

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.message.text
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text
    }));
  };

  onChangeEditText = event => {
    this.setState({editText: event.target.value});
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);

    this.setState({editMode: false});
  };

  render() {
    const {authUser, message, onRemoveMessage} = this.props;
    const {editMode, editText} = this.state;

    return (
      <div className="message_texts">
        <li>
          {editMode ? (
            <input
              type="text"
              value={editText}
              onChange={this.onChangeEditText}
            />
          ) : (
            <span className="message_item">
              <strong>{message.username}</strong> {message.text}
              {message.editedAt && <span>(Edited)</span>}
            </span>
          )}
          <br></br>
          {authUser.uid === message.userId && (
            <span>
              {editMode ? (
                <span>
                  <button className="save_button" onClick={this.onSaveEditText}>
                    Save
                  </button>
                  <br></br>
                  <button
                    className="reset_button"
                    onClick={this.onToggleEditMode}
                  >
                    Reset
                  </button>
                </span>
              ) : (
                <button
                  className="edit_button"
                  variant="warning"
                  size="sm"
                  onClick={this.onToggleEditMode}
                >
                  Edit
                </button>
              )}

              {!editMode && (
                <button
                  className="delete_button"
                  variant="danger"
                  size="md"
                  type="button"
                  onClick={() => onRemoveMessage(message.uid)}
                >
                  Delete
                </button>
              )}
            </span>
          )}
        </li>
      </div>
    );
  }
}

export default MessageItem;
