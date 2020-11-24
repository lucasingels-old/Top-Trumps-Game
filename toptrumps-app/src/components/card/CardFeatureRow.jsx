import React, {Component} from "react";
import PropTypes from "prop-types";
import {STATUS_READY} from "../../constants/constants";

class CardFeatureRow extends Component {
  handleFeatureClick = () => {
    this.props.handleFeatureClick(this.props.featureKey);
  };

  render() {
    const {
      featureKey,
      label,
      value,
      status,
      selectedFeature,
      isActivePlayer
    } = this.props;

    const featureValue =
      status === STATUS_READY && isActivePlayer ? (
        <a
          className={`card-feature-value ${selectedFeature === featureKey &&
            "selected"}`}
          onClick={this.handleFeatureClick}
        >
          {value}
        </a>
      ) : (
        <span
          className={`card-feature-value ${selectedFeature === featureKey &&
            "selected"}`}
        >
          {value}
        </span>
      );

    return (
      <div className="card-feature-row">
        <span
          className={`card-feature-label ${selectedFeature === featureKey &&
            "selected"}`}
        >
          {label}:
        </span>
        {featureValue}
      </div>
    );
  }
}

export default CardFeatureRow;
