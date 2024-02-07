import { Component, Context, ReactNode, createContext } from "react";
import Svg from "react-native-svg";
import styles from "../constants/styles";

let GameContext: Context<{}> = createContext({});

class Game extends Component {
  private gameContextValue: { screenDim: [number, number]; blockSize: number } =
    {
      screenDim: [10, 20],
      blockSize: 30,
    };

  public render(): ReactNode {
    return (
      <GameContext.Provider value={this.gameContextValue}>
        <Svg
          width={
            this.gameContextValue.screenDim[0] * this.gameContextValue.blockSize
          }
          height={
            this.gameContextValue.screenDim[1] * this.gameContextValue.blockSize
          }
          style={styles.gameSvg}
        ></Svg>
      </GameContext.Provider>
    );
  }
}

export default Game;
