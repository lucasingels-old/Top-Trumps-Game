import React from "react";
import {Route} from "react-router-dom";
import withAuthorization from "../../firebase/session/withAuthorization";
import Loading from "../Loading";

const condition = authUser => !!authUser;

const SecureRoute = ({component, ...args}) => (
  <Route component={withAuthorization(condition)(component)} {...args} />
);

export default SecureRoute;
