import React from "react";

import MessageItem from "./MessageItem";
import Messages from "./Messages";

const MessageList = ({
  authUser,
  username,
  messages,
  onEditMessage,
  onRemoveMessage
}) => (
  <ul className="message_list">
    <div>
      {messages.map(message => (
        <MessageItem
          className="sent_message"
          authUser={authUser}
          username={username}
          key={message.uid}
          message={message}
          onEditMessage={onEditMessage}
          onRemoveMessage={onRemoveMessage}
        />
      ))}
    </div>
  </ul>
);

export default MessageList;
