import React from "react";

import RoomItem from "./RoomItem";

// List of rooms to join
const RoomList = ({authUser, rooms, onJoinRoom}) => (
  <ul className="room_list">
    {rooms.map(room => (
      <RoomItem
        authUser={authUser}
        key={room.uid}
        room={room}
        onJoinRoom={onJoinRoom}
      />
    ))}
  </ul>
);

export default RoomList;
