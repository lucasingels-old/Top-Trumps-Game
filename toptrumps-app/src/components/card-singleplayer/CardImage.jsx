import React from "react";

const CardImage = props => (
  <div className="card-image-container">
    <img src={props.image} className="card-image" alt="" />
  </div>
);

export default CardImage;
