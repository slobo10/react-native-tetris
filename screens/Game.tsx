import {
  Component,
  Context,
  PropsWithChildren,
  ReactNode,
  createContext,
} from "react";
import Svg from "react-native-svg";
import styles from "../constants/styles";
import Block from "../components/Block";
import { GameContextType } from "../constants/types";

let GameContext: Context<{}> = createContext({});

class Game extends Component {
  private gameContextValue: GameContextType;

  public constructor(props: PropsWithChildren) {
    super(props);
    this.gameContextValue = {
      screenDim: [10, 20],
      blockSize: 30,
      blocks: [],
    };

    let i: number;
    let j: number;

    for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
      this.gameContextValue.blocks.push([]);
      for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
        this.gameContextValue.blocks[i].push(false);
      }
    }

    Block.contextType = GameContext;
  }

  public render(): ReactNode {
    let i: number;
    let j: number;
    let blockOutput: JSX.Element[] = [];

    // this.gameContextValue.blocks[4][19] = true;
    // this.gameContextValue.blocks[4][18] = true;
    // this.gameContextValue.blocks[4][17] = true;
    // this.gameContextValue.blocks[4][16] = true; //Example

    for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
      for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
        blockOutput.push(<Block coordinates={[i, j]} />);
      }
    }

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
        >
          {blockOutput}
        </Svg>
      </GameContext.Provider>
    );
  }
}

export default Game;

export { GameContext };
