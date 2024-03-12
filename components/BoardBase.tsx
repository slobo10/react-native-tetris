import { Component, Context, ReactNode, createContext } from "react";
import Svg from "react-native-svg";
import styles from "../constants/styles";
import Tile from "./Tile";
import { GameContextType, Tetrimino, TetriminoPiece } from "../constants/types";
import tetriminos from "../constants/tetriminos";

let GameContext: Context<{}> = createContext({});

class BoardBase extends Component<{}> {
  private speedLevel: number = 1;
  private fallingRate: number;
  private fallingInterval: NodeJS.Timeout;
  private spawnPieceTimeout: NodeJS.Timeout;
  private gameContextValue: GameContextType;
  private tetriminos: { shape: Tetrimino; color: number }[] = tetriminos;
  private fallingTetrimino: {
    position: [number, number];
    rotation: number;
    shape: Tetrimino;
    color: number;
  };

  public constructor(props: {}) {
    super(props);

    this.fallingTetrimino = {
      position: [0, 0],
      rotation: 0,
      color: 0,
      shape: [],
    };
    this.fallingRate = this.speedLevel;
    this.gameContextValue = {
      screenDim: [10, 20],
      tileSize: 30,
      tiles: [],
      tileUpdateFunctions: [],
    };

    let i: number;
    let j: number;
    Tile.contextType = GameContext;

    for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
      this.gameContextValue.tiles.push([]);
      for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
        this.gameContextValue.tiles[i].push(0);
      }
    }
    this.spawnNewTetrimino();

    this.setFallingRate(this.fallingRate);
  }

  private setFallingRate(n: number): void {
    this.fallingRate = n;
    clearInterval(this.fallingInterval);
    this.fallingInterval = setInterval(() => {
      this.moveFallingTetrimino([0, -1, 0]);
    }, 1000 / this.fallingRate);
  }

  private getFallingTetrimino(): Tetrimino {
    let i: number;
    let output: Tetrimino = [];

    switch (this.fallingTetrimino.rotation) {
      case 0: {
        for (i = 0; i < this.fallingTetrimino.shape.length; i++) {
          output.push([
            Math.floor(
              this.fallingTetrimino.position[0] +
                this.fallingTetrimino.shape[i][0]
            ),
            Math.floor(
              this.fallingTetrimino.position[1] +
                this.fallingTetrimino.shape[i][1]
            ),
          ]);
        }
        break;
      }
      case 1: {
        for (i = 0; i < this.fallingTetrimino.shape.length; i++) {
          output.push([
            Math.floor(
              this.fallingTetrimino.position[0] +
                this.fallingTetrimino.shape[i][1]
            ),
            Math.floor(
              this.fallingTetrimino.position[1] -
                this.fallingTetrimino.shape[i][0]
            ),
          ]);
        }
        break;
      }
      case 2: {
        for (i = 0; i < this.fallingTetrimino.shape.length; i++) {
          output.push([
            Math.floor(
              this.fallingTetrimino.position[0] -
                this.fallingTetrimino.shape[i][0]
            ),
            Math.floor(
              this.fallingTetrimino.position[1] -
                this.fallingTetrimino.shape[i][1]
            ),
          ]);
        }
        break;
      }
      case 3: {
        for (i = 0; i < this.fallingTetrimino.shape.length; i++) {
          output.push([
            Math.floor(
              this.fallingTetrimino.position[0] -
                this.fallingTetrimino.shape[i][1]
            ),
            Math.floor(
              this.fallingTetrimino.position[1] +
                this.fallingTetrimino.shape[i][0]
            ),
          ]);
        }
        break;
      }
    }
    return output;
  }

  private spawnNewTetrimino() {
    let i: number;
    let j: number;
    let spawnYOffset: number = 0;
    let madeLine: boolean = false;
    let lineLocations: number[] = [];
    let fallingTetrimino: Tetrimino;
    let newTetrimino: TetriminoPiece =
      this.tetriminos[Math.floor(Math.random() * this.tetriminos.length)];

    //Find lines and clear them
    for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
      madeLine = true;
      for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
        if (this.gameContextValue.tiles[i][j] === 0) {
          madeLine = false;
          break;
        }
      }
      if (madeLine) {
        lineLocations.push(j);
        for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
          this.gameContextValue.tiles[i][j] = 0;
        }
      }
    }

    //Make other tetriminos fall into cleared line
    if (lineLocations.length > 0) {
      let linesProcessed: number = 0;

      lineLocations.sort((a, b) => a - b);

      for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
        if (lineLocations[linesProcessed] === j + linesProcessed) {
          linesProcessed++;
          j--;
          continue;
        }
        for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
          this.gameContextValue.tiles[i][j] =
            this.gameContextValue.tiles[i][j + linesProcessed];
        }
      }
    }

    //Find out how low to spawn new tetrimino
    for (i = 0; i < newTetrimino.shape.length; i++) {
      if (
        newTetrimino.shape[i][1] +
          this.gameContextValue.screenDim[1] -
          spawnYOffset >
        this.gameContextValue.screenDim[1] - 1
      ) {
        spawnYOffset = newTetrimino.shape[i][1] + 1;
      }
    }

    //Spawn new tetrimino
    this.fallingTetrimino = {
      position: [
        Math.ceil((this.gameContextValue.screenDim[0] - 1) / 2),
        this.gameContextValue.screenDim[1] - spawnYOffset,
      ],
      rotation: 0,
      color: newTetrimino.color,
      shape: newTetrimino.shape,
    };

    fallingTetrimino = this.getFallingTetrimino();

    //Add new tetrimino to the board
    for (i = 0; i < fallingTetrimino.length; i++) {
      this.gameContextValue.tiles[fallingTetrimino[i][0]][
        fallingTetrimino[i][1]
      ] = this.fallingTetrimino.color;
    }

    for (i = 0; i < this.gameContextValue.tileUpdateFunctions.length; i++) {
      this.gameContextValue.tileUpdateFunctions[i]();
    }
  }

  public moveFallingTetrimino(coords: [number, number, number]): void {
    let i: number;
    let j: number;
    let k: number;
    let tetriminoTouchedDown: boolean = false;
    let touchingOtherTiles: boolean = false;
    let tetriminoHasMoved: boolean = true;
    let fallingTetrimino: Tetrimino = this.getFallingTetrimino();

    //Remove falling tetrimino from board
    for (i = 0; i < fallingTetrimino.length; i++) {
      this.gameContextValue.tiles[fallingTetrimino[i][0]][
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
      for (j = 0; j < this.gameContextValue.tiles.length; j++) {
        for (k = 0; k < this.gameContextValue.tiles[j].length; k++) {
          if (this.gameContextValue.tiles[j][k]) {
            if (fallingTetrimino[i][0] === j && fallingTetrimino[i][1] === k) {
              touchingOtherTiles = true;
              break;
            }
          }
        }
        if (touchingOtherTiles) {
          break;
        }
      }
      if (
        touchingOtherTiles ||
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

    //Check if falling tetrimino is touching fallen tiles
    for (i = 0; i < this.gameContextValue.tiles.length; i++) {
      for (j = 0; j < this.gameContextValue.tiles[i].length; j++) {
        if (this.gameContextValue.tiles[i][j]) {
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

    //Readd tetrimino to board
    for (i = 0; i < fallingTetrimino.length; i++) {
      this.gameContextValue.tiles[fallingTetrimino[i][0]][
        fallingTetrimino[i][1]
      ] = this.fallingTetrimino.color;
    }

    //Make tetrimino land
    if (tetriminoTouchedDown && tetriminoHasMoved) {
      clearTimeout(this.spawnPieceTimeout);
      this.spawnPieceTimeout = setTimeout(() => {
        this.spawnNewTetrimino();
      }, 500);
    } else if (!tetriminoTouchedDown) {
      clearTimeout(this.spawnPieceTimeout);
    }

    //Tell tiles to rerender if needed
    for (i = 0; i < this.gameContextValue.tileUpdateFunctions.length; i++) {
      this.gameContextValue.tileUpdateFunctions[i]();
    }
  }

  public startSoftDrop(): void {
    this.setFallingRate(15);
  }

  public endSoftDrop(): void {
    this.setFallingRate(this.speedLevel);
  }

  public render(): ReactNode {
    console.log("Game rendered!");

    let i: number;
    let j: number;
    let tileOutput: JSX.Element[] = [];

    for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
      for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
        tileOutput.push(
          <Tile coordinates={[i, j]} key={"tile" + i + "," + j} />
        );
      }
    }

    return (
      <GameContext.Provider value={this.gameContextValue}>
        <Svg
          width={
            this.gameContextValue.screenDim[0] * this.gameContextValue.tileSize
          }
          height={
            this.gameContextValue.screenDim[1] * this.gameContextValue.tileSize
          }
          style={styles.gameSvg}
        >
          {tileOutput}
        </Svg>
      </GameContext.Provider>
    );
  }
}

export default BoardBase;

export { GameContext };
