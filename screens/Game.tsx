import BoardBase from "../components/BoardBase";
import { Component, ReactNode } from "react";
import PlayerBoard from "../components/PlayerBoard";

class Game extends Component {
  public render(): ReactNode {
    return (
      <>
        <PlayerBoard />
      </>
    );
  }
}

export default Game;
