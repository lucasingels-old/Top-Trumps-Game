import React from "react";
import Card from "./Card";
import SelectedFeature from "./SelectedFeature";

import {STATUS_READY} from "../../constants/constants";

const CardContainer = props => {
  const {
    card,
    isClosed,
    isActivePlayer,
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
        isActivePlayer={isActivePlayer}
        handleFeatureSelection={handleFeatureSelection}
        status={status}
        selectedFeature={
          !isActivePlayer && status === STATUS_READY ? "" : selectedFeature
        }
      />
      {!isClosed && isActivePlayer ? (
        <SelectedFeature
          selectedFeature={selectedFeature}
          featureValue={card[selectedFeature]}
        />
      ) : null}
    </div>
  );
};

export default CardContainer;
