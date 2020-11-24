import React from "react";

const Button = props => {
  const {buttonClassName, buttonOnClick, buttonLabel, buttonIsDisabled} = props;

  return (
    <button
      className={`btn ${buttonClassName} ${buttonIsDisabled && "disabled"}`}
      onClick={buttonOnClick}
      disabled={buttonIsDisabled}
    >
      {buttonLabel}
    </button>
  );
};

Button.defaultProps = {
  buttonClassName: "",
  buttonOnClick: () => {},
  buttonLabel: "",
  buttonIsDisabled: true
};

export default Button;
