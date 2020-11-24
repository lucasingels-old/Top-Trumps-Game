import React from "react";
import Card from "./Card";
import SelectedFeature from "./SelectedFeature";

const CardContainer = props => {
  const {
    card,
    isClosed,
    isWinner,
    selectedFeature,
    handleFeatureSelection,
    status
  } = props;

  return (
    <div className={`card-container ${isWinner && "winner"}`}>
      <div className="card-result">Winner</div>
      <Card
        card={card}
        isClosed={isClosed}
        handleFeatureSelection={handleFeatureSelection}
        status={status}
        selectedFeature={selectedFeature}
      />
      {!isClosed ? (
        <SelectedFeature
          selectedFeature={selectedFeature}
          featureValue={card[selectedFeature]}
        />
      ) : null}
    </div>
  );
};

export default CardContainer;
