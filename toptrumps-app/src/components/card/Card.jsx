import React from "react";
import CardHeader from "./CardHeader";
import CardImage from "./CardImage";
import CardFeatureList from "./CardFeatureList";

const Card = props => {
  const {
    isClosed,
    isActivePlayer,
    card,
    handleFeatureSelection,
    status,
    selectedFeature
  } = props;

  return (
    <div className={`card ${isClosed && "closed"}`}>
      {!isClosed ? (
        <div>
          <CardHeader name={card.name} nationality={card.nationality} />
          <CardImage image={card.image} />
          <CardFeatureList
            card={card}
            handleFeatureSelection={handleFeatureSelection}
            status={status}
            selectedFeature={selectedFeature}
            isActivePlayer={isActivePlayer}
          />
        </div>
      ) : (
        <img className="top_back" src="../../assets/images/logoback.png" />
      )}
    </div>
  );
};

export default Card;
