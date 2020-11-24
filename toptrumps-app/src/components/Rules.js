import Button from "react-bootstrap/Button";
import React from "react";
import {Row, Col} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import NavBar from "./NavBar";

import history from "../utils/history";

// Text for the rules of the game
// Rules have been taken from this page:https://www.pagat.com/com/top_trumps.html
const Rules = () => {
  return (
    <div className="rules">
      <NavBar />
      <h1 class="h1">Game Rules</h1>

      <h2 class="players_and_cards"> Players and Cards </h2>
      <p class="players_and_cards_paragraph">
        <ul>
          <li> Deck consists of 32 cards.</li>
          <li> Deck is shuffled each player gets 16 cards.</li>
          <li> Each card has 5 attribute to choose from. </li>
          <li> Player selects what seems to be the best attribute. </li>
          <li> The card with the highest attribute wins the round. </li>
          <li>
            {" "}
            The winner of the previous round chooses that next attribute.{" "}
          </li>
          <li> The game is won when one player has the whole deck.</li>
        </ul>
      </p>

      <h2 class="ties"> Ties </h2>
      <p class="ties_paragraph">
        <ul>
          <li>
            {" "}
            Draws will occur if the attribute selected is the same on each card.
          </li>
          <li>
            {" "}
            If this happens, the player who won the previous round will go
            again.
          </li>
          <li>
            {" "}
            When a draw occurs, the cards will be 'held aside', until a player
            wins a round.{" "}
          </li>
        </ul>
      </p>
    </div>
  );
};

export default Rules;
