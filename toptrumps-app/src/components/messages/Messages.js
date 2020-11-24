import React, {Component} from "react";

import AuthUserContext from "../../firebase/session/context";
import {withFirebase} from "../../firebase/context";
import MessageList from "./MessageList";
import MessageItem from "./MessageItem";
import Button from "react-bootstrap/Button";
import NavBar from "../NavBar";

var username;

class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      loading: false,
      messages: [],
      limit: 5
    };
  }

  componentDidMount() {
    this.onListenForMessages();
  }

  componentWillMount() {
    this.props.firebase.messages().off();
  }

  onListenForMessages = async () => {
    this.setState({loading: true});

    await this.props.firebase.user(this.context.uid).once("value", snapshot => {
      username = snapshot.val().username;
    });

    this.props.firebase
      .messages()
      .orderByChild("createdAt")
      .limitToLast(this.state.limit)
      .on("value", snapshot => {
        const messageObject = snapshot.val();

        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key
          }));

          this.setState({
            messages: messageList,
            loading: false
          });
        } else {
          this.setState({messages: null, loading: false});
        }
      });
  };

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onChangeText = event => {
    this.setState({text: event.target.value});
  };

  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid,
      username: username,
      createdAt: this.props.firebase.serverValue.TIMESTAMP
    });

    this.setState({text: ""});

    event.preventDefault();
  };

  onEditMessage = (message, text) => {
    const {uid, ...messageSnapshot} = message;

    this.props.firebase.message(message.uid).set({
      ...messageSnapshot,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP
    });
  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onNextPage = () => {
    this.setState(
      state => ({limit: state.limit + 5}),
      this.onListenForMessages
    );
  };

  render() {
    const {text, messages, loading} = this.state;

    return (
      <div className="messanger">
        <h1 className="room_header">Chats</h1>
        {!loading && messages && (
          <Button
            variant="outline-light"
            size="sm"
            type="button"
            onClick={this.onNextPage}
          >
            More
          </Button>
        )}

        {loading && <div>Loading ...</div>}

        {messages && (
          <MessageList
            authUser={this.context}
            messages={messages}
            onEditMessage={this.onEditMessage}
            onRemoveMessage={this.onRemoveMessage}
          />
        )}

        {!messages && <div>There are no messages ...</div>}

        <form
          className="message_form"
          onSubmit={event => this.onCreateMessage(event, this.context)}
        >
          <input
            className="message_field"
            type="text"
            value={text}
            onChange={this.onChangeText}
          />
          <Button type="submit">Send</Button>
        </form>
        <NavBar />
      </div>
    );
  }
}

Messages.contextType = AuthUserContext;

export default withFirebase(Messages);
