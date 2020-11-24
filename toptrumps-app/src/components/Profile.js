import React, {Component} from "react";

import Button from "react-bootstrap/Button";
import {Row, Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";

import NavBar from "./NavBar";
import Loading from "./Loading";
import AuthUserContext from "../firebase/session/context";
import {withFirebase} from "../firebase/context";
import logo from "../images/Logo.png";
import history from "../utils/history";
import avatar from "../images/avatar3.png";

var userUID = "";
var username = "";
var email = "";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.setUpProfile();
  }

  setUpProfile = async () => {
    let authUser = this.context;
    const userUID = authUser.uid;

    await this.props.firebase.user(userUID).once("value", snapshot => {
      username = snapshot.val().username;
      email = snapshot.val().email;
    });

    this.setState({
      loading: false
    });
  };

  render() {
    const {loading} = this.state;
    return (
      <div>
        {loading && <Loading />}

        {!loading && (
          <div className="profile-container">
            <p className="profile_heading">Profile</p>
            <p className="profile_container">
              <img className="avatar_photo" src={avatar} alt="Avatar" />
            </p>
            <p className="player_name">Name: {username} </p>
            <p className="player_email">Email: {email} </p>
            <p className="profile_details"></p>
            <NavBar />
          </div>
        )}
      </div>
    );
  }
}

Profile.contextType = AuthUserContext;

export default withFirebase(Profile);
