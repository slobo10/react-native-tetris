import { Component, ReactNode } from "react";
import Svg from "react-native-svg";
import styles from "../constants/styles";

class Game extends Component {
  private gameConstants: { screenDim: [number, number]; blockSize: number } = {
    screenDim: [10, 20],
    blockSize: 30,
  };

  public render(): ReactNode {
    return (
      <Svg
        width={this.gameConstants.screenDim[0] * this.gameConstants.blockSize}
        height={this.gameConstants.screenDim[1] * this.gameConstants.blockSize}
        style={styles.gameSvg}
      ></Svg>
    );
  }
}

export default Game;
