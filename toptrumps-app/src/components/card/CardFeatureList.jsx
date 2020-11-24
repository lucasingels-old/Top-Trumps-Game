import React from "react";
import CardFeatureRow from "./CardFeatureRow";
import features from "../../constants/features";

const CardFeatureList = props => {
  const {
    card,
    handleFeatureSelection,
    status,
    selectedFeature,
    isActivePlayer
  } = props;

  const featureListItems = Object.keys(features).map(featureKey => {
    return (
      <CardFeatureRow
        key={`feature-${featureKey}`}
        featureKey={featureKey}
        label={features[featureKey]}
        value={card[featureKey]}
        handleFeatureClick={handleFeatureSelection}
        selectedFeature={selectedFeature}
        status={status}
        isActivePlayer={isActivePlayer}
      />
    );
  });

  return <div className="card-feature-list">{featureListItems}</div>;
};

export default CardFeatureList;
