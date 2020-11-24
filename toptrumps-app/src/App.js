import React, {useContext} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

import Home from './components/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import PasswordForget from './components/auth/PasswordForget';
import Profile from './components/Profile';
import GameBoardSingleplayer from './components/GameBoardSingleplayer';
import GameBoardMP from './components/GameBoardMP';
import Messages from './components/messages/Messages';
import Rules from './components/Rules';
import Rooms from './components/rooms/Rooms';
import SecureRoute from './components/auth/SecureRoute';
import AuthUserContext from './firebase/session/context';
import withAuthorization from './firebase/session/withAuthorization';
import withAuthentication from './firebase/session/withAuthentication';

import { withFirebase } from './firebase/context';
import history from './utils/history';

const App = () => (
  <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/forgotpassword" component={PasswordForget} />
            <Route path="/rules" component={Rules} />
            <SecureRoute path="/profile" component={Profile} />
            <SecureRoute path="/messages" component={Messages} />
            <SecureRoute path="/rooms" component={Rooms} />
            <SecureRoute path="/game/singleplayer" component={GameBoardSingleplayer} />
            <SecureRoute path="/game/multiplayer" component={GameBoardMP} />
            <SecureRoute path="/messages" component={Messages} />``
          </Switch>
  </BrowserRouter>
);

export default withAuthentication(App);
