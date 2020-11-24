import React from "react";
import Button from "react-bootstrap/Button";
import {Row, Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";

import logo from "../images/Logo.png";
import history from "../utils/history";
import NavBar from "./NavBar";

const Home = () => {
  return (
    <div className="home-container">
      <NavBar />
      <Container>
        <Col>
          <Row className="home_grid">
            <img src={logo} alt="Top Trumps" />
          </Row>
          <Row className="home_grid">
            <Button
              variant="primary"
              onClick={() => history.push("/game/singleplayer")}
              disabled={false}
            >
              Tutorial
            </Button>
            <Button
              variant="primary"
              onClick={() => history.push("/rooms")}
              disabled={false}
            >
              Multiplayer
            </Button>
          </Row>
        </Col>
      </Container>
    </div>
  );
};

export default Home;
