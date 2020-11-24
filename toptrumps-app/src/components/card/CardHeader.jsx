import React from "react";

const CardHeader = props => {
  const {name, nationality} = props;

  return (
    <div className="card-header">
      <h3>{name}</h3>
      <div className="card-additional-info">
        <div>Nationality: {nationality}</div>
      </div>
    </div>
  );
};

export default CardHeader;
