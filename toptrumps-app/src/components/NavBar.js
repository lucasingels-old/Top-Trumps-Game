import React, {useState} from "react";
import {NavLink as RouterNavLink} from "react-router-dom";

import LoginButton from "./auth/LoginButton";
import SignUpButton from "./auth/SignUpButton";
import LogoutButton from "./auth/LogoutButton";
import ProfileButton from "./auth/ProfileButton";
import AuthUserContext from "../firebase/session/context";

import history from "../utils/history";
import "../styles/main.scss";

import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button
} from "react-bootstrap";

const NavBar = () => (
  <AuthUserContext.Consumer>
    {authUser => (authUser ? <NavBarAuth /> : <NavBarNonAuth />)}
  </AuthUserContext.Consumer>
);

const NavBarAuth = () => (
  <Navbar fixed="top" variant="dark" className="standard_navbar">
    <Navbar.Brand href="/">Top Trumps</Navbar.Brand>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/rules">Rules</Nav.Link>
        <Nav.Link href="/profile">Profile</Nav.Link>
        <Nav.Link href="/messages">Chat Room</Nav.Link>
      </Nav>
      <LogoutButton />
    </Navbar.Collapse>
  </Navbar>
);

const NavBarNonAuth = () => (
  <Navbar fixed="top" variant="dark" className="standard_navbar">
    <Navbar.Brand href="/">Top Trumps</Navbar.Brand>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/rules">Rules</Nav.Link>
        <Nav.Link href="/profile">Profile</Nav.Link>
        <Nav.Link href="/messages">Chat Room</Nav.Link>
      </Nav>
      <LoginButton />
      <SignUpButton />
    </Navbar.Collapse>
  </Navbar>
);

export default NavBar;
