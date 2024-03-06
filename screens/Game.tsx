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
    tetrimino: { shape: Tetrimino; color: number };
  };
  private tetriminos: { shape: Tetrimino; color: number }[]; //Colors: Cyan I, Yellow O, Purple T, Green S, Blue J, Red Z, Orange L
  private frameRate: number;
  private playTime: number;
  private timeToDrop: number | undefined;

  private getFallingTetrimino(): Tetrimino {
    let i: number;
    let output: Tetrimino = [];
    switch (this.fallingTetrimino.rotation) {
      case 0: {
        for (i = 0; i < this.fallingTetrimino.tetrimino.shape.length; i++) {
          output.push([
            Math.floor(
              this.fallingTetrimino.position[0] +
                this.fallingTetrimino.tetrimino.shape[i][0]
            ),
            Math.floor(
              this.fallingTetrimino.position[1] +
                this.fallingTetrimino.tetrimino.shape[i][1]
            ),
          ]);
        }
        break;
      }
      case 1: {
        for (i = 0; i < this.fallingTetrimino.tetrimino.shape.length; i++) {
          output.push([
            Math.floor(
              this.fallingTetrimino.position[0] +
                this.fallingTetrimino.tetrimino.shape[i][1]
            ),
            Math.floor(
              this.fallingTetrimino.position[1] -
                this.fallingTetrimino.tetrimino.shape[i][0]
            ),
          ]);
        }
        break;
      }
      case 2: {
        for (i = 0; i < this.fallingTetrimino.tetrimino.shape.length; i++) {
          output.push([
            Math.floor(
              this.fallingTetrimino.position[0] -
                this.fallingTetrimino.tetrimino.shape[i][0]
            ),
            Math.floor(
              this.fallingTetrimino.position[1] -
                this.fallingTetrimino.tetrimino.shape[i][1]
            ),
          ]);
        }
        break;
      }
      case 3: {
        for (i = 0; i < this.fallingTetrimino.tetrimino.shape.length; i++) {
          output.push([
            Math.floor(
              this.fallingTetrimino.position[0] -
                this.fallingTetrimino.tetrimino.shape[i][1]
            ),
            Math.floor(
              this.fallingTetrimino.position[1] +
                this.fallingTetrimino.tetrimino.shape[i][0]
            ),
          ]);
        }
        break;
      }
    }
    return output;
  }
  private moveFallingTetrimino(coords: [number, number, number]): void {
    let i: number;
    let j: number;
    let k: number;
    let tetriminoTouchedDown: boolean = false;
    let tetriminoFallen: boolean = false;
    let lineLocations: number[] = [];
    let fallingTetrimino: Tetrimino = this.getFallingTetrimino();
    let touchingOtherBlocks: boolean = false;
    let tetriminoHasMoved: boolean = true;

    //Remove falling tetrimino from board
    for (i = 0; i < fallingTetrimino.length; i++) {
      this.gameContextValue.blocks[fallingTetrimino[i][0]][
        fallingTetrimino[i][1]
      ] = 0;
    }

    //Move falling tetrimino
    this.fallingTetrimino.position[0] += coords[0];
    this.fallingTetrimino.position[1] += coords[1];
    this.fallingTetrimino.rotation += coords[2];
    if (this.fallingTetrimino.rotation > 3) {
      this.fallingTetrimino.rotation = this.fallingTetrimino.rotation % 4;
    } else if (this.fallingTetrimino.rotation < 0) {
      this.fallingTetrimino.rotation = 4 + (this.fallingTetrimino.rotation % 4);
    }
    fallingTetrimino = this.getFallingTetrimino();

    //Check if tetrimino can move
    for (i = 0; i < fallingTetrimino.length; i++) {
      for (j = 0; j < this.gameContextValue.blocks.length; j++) {
        for (k = 0; k < this.gameContextValue.blocks[j].length; k++) {
          if (this.gameContextValue.blocks[j][k]) {
            if (fallingTetrimino[i][0] === j && fallingTetrimino[i][1] === k) {
              touchingOtherBlocks = true;
              break;
            }
          }
        }
        if (touchingOtherBlocks) {
          break;
        }
      }
      if (
        touchingOtherBlocks ||
        fallingTetrimino[i][0] < 0 ||
        fallingTetrimino[i][0] > this.gameContextValue.screenDim[0] - 1 ||
        fallingTetrimino[i][1] < 0
      ) {
        this.fallingTetrimino.position[0] -= coords[0];
        this.fallingTetrimino.position[1] -= coords[1];
        this.fallingTetrimino.rotation -= coords[2];
        if (this.fallingTetrimino.rotation > 3) {
          this.fallingTetrimino.rotation = this.fallingTetrimino.rotation % 4;
        } else if (this.fallingTetrimino.rotation < 0) {
          this.fallingTetrimino.rotation =
            4 + (this.fallingTetrimino.rotation % 4);
        }
        fallingTetrimino = this.getFallingTetrimino();
        tetriminoHasMoved = false;
        break;
      }
    }

    //Check if falling tetrimino is touching the ground
    for (i = 0; i < fallingTetrimino.length; i++) {
      if (fallingTetrimino[i][1] === 0) {
        tetriminoTouchedDown = true;
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
              tetriminoTouchedDown = true;
              break;
            }
          }
        }
      }
    }

    //Make tetrimino land
    if (tetriminoTouchedDown) {
      if (this.playTime >= this.timeToDrop && this.timeToDrop) {
        for (i = 0; i < fallingTetrimino.length; i++) {
          this.gameContextValue.blocks[fallingTetrimino[i][0]][
            fallingTetrimino[i][1]
          ] = this.fallingTetrimino.tetrimino.color;
        }

        tetriminoFallen = true;

        this.timeToDrop = undefined;
      } else if (!this.timeToDrop || tetriminoHasMoved) {
        this.timeToDrop = this.playTime + 400;
      }
    } else {
      this.timeToDrop = undefined;
    }

    //Readd tetrimino to board
    for (i = 0; i < fallingTetrimino.length; i++) {
      this.gameContextValue.blocks[fallingTetrimino[i][0]][
        fallingTetrimino[i][1]
      ] = this.fallingTetrimino.tetrimino.color;
    }

    //Spawn new tetrimino
    if (tetriminoFallen) {
      this.fallingTetrimino = {
        position: [5, 20],
        rotation: 0,
        tetrimino:
          this.tetriminos[Math.floor(Math.random() * this.tetriminos.length)],
      };
    }

    //Clear lines
    if (tetriminoFallen) {
      let madeLine: boolean = false;

      for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
        madeLine = true;
        for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
          if (this.gameContextValue.blocks[i][j] === 0) {
            madeLine = false;
            break;
          }
        }
        if (madeLine) {
          lineLocations.push(j);
          for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
            this.gameContextValue.blocks[i][j] = 0;
          }
        }
      }
    }

    lineLocations.sort();

    //Make fallen blocks fall into cleared lines
    if (lineLocations.length > 0) {
      let linesProcessed: number = 0;

      for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
        if (lineLocations[linesProcessed] === j + linesProcessed) {
          linesProcessed++;
          j--;
          continue;
        }
        for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
          this.gameContextValue.blocks[i][j] =
            this.gameContextValue.blocks[i][j + linesProcessed];
        }
      }
    }

    //Tell blocks to rerender if needed
    for (i = 0; i < this.gameContextValue.blockUpdateFunctions.length; i++) {
      this.gameContextValue.blockUpdateFunctions[i]();
    }
  }

  private update(This: Game): void {
    This.moveFallingTetrimino([0, -1, 0]);
    This.playTime += 1000 / This.frameRate;
  }

  private keyDownEventHandler(This: Game, event: KeyboardEvent): void {
    if (!event.repeat) {
      switch (event.key.toUpperCase()) {
        case "D": {
          This.moveFallingTetrimino([1, 0, 0]);
          break;
        }
        case "A": {
          This.moveFallingTetrimino([-1, 0, 0]);
          break;
        }
        case "ARROWRIGHT": {
          This.moveFallingTetrimino([0, 0, 1]);
          break;
        }
        case "ARROWDOWN": {
          This.moveFallingTetrimino([0, 0, -1]);
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
      //Longbar
      {
        color: 6,
        shape: [
          [0.5, 1.5],
          [0.5, 0.5],
          [0.5, -0.5],
          [0.5, -1.5],
        ],
      },
      //T
      {
        color: 7,
        shape: [
          [-1, 0],
          [0, 0],
          [1, 0],
          [0, -1],
        ],
      },
      //L
      {
        color: 2,
        shape: [
          [1, 0],
          [0, 0],
          [-1, 0],
          [-1, -1],
        ],
      },
      //Anti-L
      {
        color: 5,
        shape: [
          [1, 0],
          [0, 0],
          [-1, 0],
          [1, -1],
        ],
      },
      //S
      {
        color: 4,
        shape: [
          [1, 1],
          [0, 1],
          [0, 0],
          [-1, 0],
        ],
      },
      //Z
      {
        color: 1,
        shape: [
          [-1, 1],
          [0, 1],
          [0, 0],
          [1, 0],
        ],
      },
      //Square
      {
        color: 3,
        shape: [
          [0.5, 0.5],
          [0.5, -0.5],
          [-0.5, -0.5],
          [-0.5, 0.5],
        ],
      },
    ];
    this.fallingTetrimino = {
      position: [5, 20],
      rotation: 0,
      tetrimino:
        this.tetriminos[Math.floor(Math.random() * this.tetriminos.length)],
    };
    this.frameRate = 10;
    this.playTime = 0;

    let i: number;
    let j: number;
    let fallingTetrimino: Tetrimino = this.getFallingTetrimino();

    for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
      this.gameContextValue.blocks.push([]);
      for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
        this.gameContextValue.blocks[i].push(0);
      }
    }

    for (i = 0; i < this.fallingTetrimino.tetrimino.shape.length; i++) {
      this.gameContextValue.blocks[fallingTetrimino[i][0]][
        fallingTetrimino[i][1]
      ] = this.fallingTetrimino.tetrimino.color;
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
