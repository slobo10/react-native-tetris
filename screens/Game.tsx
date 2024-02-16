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
import { GameContextType, Tetrimino } from "../constants/types";

let GameContext: Context<{}> = createContext({});

class Game extends Component {
  private gameContextValue: GameContextType;
  private fallingTetrimino: {
    position: [number, number];
    rotation: number;
    terimino: Tetrimino;
  };
  private tetriminos: Tetrimino[];
  private frameRate: number;
  private update(This: Game): void {
    let i: number;
    let tetriminoHasFallen: boolean = false;

    for (i = 0; i < This.fallingTetrimino.terimino.length; i++) {
      This.gameContextValue.blocks[
        This.fallingTetrimino.terimino[i][0] + This.fallingTetrimino.position[0]
      ][
        This.fallingTetrimino.terimino[i][1] + This.fallingTetrimino.position[1]
      ] = false;
    }

    for (i = 0; i < This.fallingTetrimino.terimino.length; i++) {
      if (
        This.fallingTetrimino.terimino[i][1] +
          This.fallingTetrimino.position[1] ===
        0
      ) {
        tetriminoHasFallen = true;
      }
    }
    for (i = 0; i < This.gameContextValue.blocks.length; i++) {
      for (j = 0; j < This.gameContextValue.blocks[i].length; j++) {
        if (This.gameContextValue.blocks[i][j]) {
          for (k = 0; k < This.fallingTetrimino.terimino.length; k++) {
            if (
              This.fallingTetrimino.terimino[k][1] +
                This.fallingTetrimino.position[1] ===
                j + 1 &&
              This.fallingTetrimino.terimino[k][0] +
                This.fallingTetrimino.position[0] ===
                i
            ) {
              tetriminoHasFallen = true;
              break;
            }
          }
        }
      }
    }

    if (!tetriminoHasFallen) {
      This.fallingTetrimino.position[1]--;
    } else {
      for (i = 0; i < This.fallingTetrimino.terimino.length; i++) {
        This.gameContextValue.blocks[
          This.fallingTetrimino.terimino[i][0] +
            This.fallingTetrimino.position[0]
        ][
          This.fallingTetrimino.terimino[i][1] +
            This.fallingTetrimino.position[1]
        ] = true;
      }
      This.fallingTetrimino = {
        position: [5, 20],
        rotation: 0,
        terimino: This.tetriminos[0],
      };
    }

    for (i = 0; i < This.fallingTetrimino.terimino.length; i++) {
      This.gameContextValue.blocks[
        This.fallingTetrimino.terimino[i][0] + This.fallingTetrimino.position[0]
      ][
        This.fallingTetrimino.terimino[i][1] + This.fallingTetrimino.position[1]
      ] = true;
    }

    for (i = 0; i < this.gameContextValue.blockUpdateFunctions.length; i++) {
      this.gameContextValue.blockUpdateFunctions[i]();
    }
  }

  private start(): void {
    setInterval(() => {
      this.update(this);
    }, 1000 / this.frameRate);
  }

  public constructor(props: PropsWithChildren) {
    super(props);
    this.gameContextValue = {
      screenDim: [10, 20],
      blockSize: 30,
      blocks: [],
      blockUpdateFunctions: [],
    };
    this.tetriminos = [
      [
        [0, -2],
        [0, -1],
        [0, 0],
        [0, 1],
      ],
    ];
    this.fallingTetrimino = {
      position: [5, 10],
      rotation: 0,
      terimino: this.tetriminos[0],
    };
    this.fallenTetriminos = [];
    this.frameRate = 1;

    let i: number;
    let j: number;

    for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
      this.gameContextValue.blocks.push([]);
      for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
        this.gameContextValue.blocks[i].push(false);
      }
    }

    for (i = 0; i < this.fallingTetrimino.terimino.length; i++) {
      this.gameContextValue.blocks[
        this.fallingTetrimino.terimino[i][0] + this.fallingTetrimino.position[0]
      ][
        this.fallingTetrimino.terimino[i][1] + this.fallingTetrimino.position[1]
      ] = true;
    }

    for (i = 0; i < this.fallenTetriminos.length; i++) {
      this.gameContextValue.blocks[this.fallenTetriminos[i][0]][
        this.fallenTetriminos[i][1]
      ] = true;
    }

    Block.contextType = GameContext;

    this.start();
  }

  public render(): ReactNode {
    console.log("Game rendered!");

    let i: number;
    let j: number;
    let blockOutput: JSX.Element[] = [];

    for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
      for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
        blockOutput.push(
          <Block coordinates={[i, j]} key={"block" + i + "," + j} />
        );
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
