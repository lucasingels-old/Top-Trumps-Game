import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Firebase from './firebase/firebase';
import FirebaseContext from './firebase/context';
import './styles/main.scss';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>,
  </BrowserRouter>,
  document.getElementById("root")
);
