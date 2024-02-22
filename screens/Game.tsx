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
  private getFallingTetrimino(): Tetrimino {
    let i: number;
    let output: Tetrimino = [];
    for (i = 0; i < this.fallingTetrimino.terimino.length; i++) {
      output.push([
        this.fallingTetrimino.position[0] +
          this.fallingTetrimino.terimino[i][0],
        this.fallingTetrimino.position[1] +
          this.fallingTetrimino.terimino[i][1],
      ]);
    }
    return output;
  }
  private moveFallingTetrimino(coords: [number, number]): void {
    let i: number;
    let j: number;
    let k: number;
    let tetriminoHasFallen: boolean = false;
    let fallingTetrimino: Tetrimino = this.getFallingTetrimino();

    //Remove falling tetrimino from board
    for (i = 0; i < fallingTetrimino.length; i++) {
      this.gameContextValue.blocks[fallingTetrimino[i][0]][
        fallingTetrimino[i][1]
      ] = false;
    }

    //Check if falling tetrimino is touching the ground
    for (i = 0; i < fallingTetrimino.length; i++) {
      if (fallingTetrimino[i][1] === 0) {
        tetriminoHasFallen = true;
        break;
      }
    }
    //Check if falling tetrimino is touching fallen blocks
    for (i = 0; i < this.gameContextValue.blocks.length; i++) {
      for (j = 0; j < this.gameContextValue.blocks[i].length; j++) {
        if (this.gameContextValue.blocks[i][j]) {
          for (k = 0; k < fallingTetrimino.length; k++) {
            if (
              fallingTetrimino[k][1] === j + 1 &&
              fallingTetrimino[k][0] === i
            ) {
              tetriminoHasFallen = true;
              break;
            }
          }
        }
      }
    }

    //If tetrimino has not fallen, move it accordingly. Else, spawn new tetrimino
    if (!tetriminoHasFallen) {
      this.fallingTetrimino.position[0] += coords[0];
      this.fallingTetrimino.position[1] += coords[1];
      fallingTetrimino = this.getFallingTetrimino();
    } else {
      for (i = 0; i < this.fallingTetrimino.terimino.length; i++) {
        this.gameContextValue.blocks[fallingTetrimino[i][0]][
          fallingTetrimino[i][1]
        ] = true;
      }
      this.fallingTetrimino = {
        position: [5, 20],
        rotation: 0,
        terimino: this.tetriminos[0],
      };
    }

    //Readd tetrimino to board
    for (i = 0; i < fallingTetrimino.length; i++) {
      this.gameContextValue.blocks[fallingTetrimino[i][0]][
        fallingTetrimino[i][1]
      ] = true;
    }

    for (i = 0; i < this.gameContextValue.blockUpdateFunctions.length; i++) {
      this.gameContextValue.blockUpdateFunctions[i]();
    }
  }

  private update(This: Game): void {
    This.moveFallingTetrimino([0, -1]);
  }

  private keyDownEventHandler(This: Game, event: KeyboardEvent): void {
    if (!event.repeat) {
      if (event.key.toLocaleUpperCase() === "D") {
      }
      switch (event.key.toUpperCase()) {
        case "D": {
          This.moveFallingTetrimino([1, 0]);
          break;
        }
        case "A": {
          This.moveFallingTetrimino([-1, 0]);
          break;
        }
      }
    }
  }

  private start(): void {
    setInterval(() => {
      this.update(this);
    }, 1000 / this.frameRate);
    document.addEventListener("keydown", (event) => {
      this.keyDownEventHandler(this, event);
    });
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
      position: [4, 20],
      rotation: 0,
      terimino: this.tetriminos[0],
    };
    this.frameRate = 10;

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
