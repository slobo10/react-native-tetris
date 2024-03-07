import { Component, Context, ReactNode, createContext } from "react";
import Svg from "react-native-svg";
import styles from "../constants/styles";
import Tile from "../components/Tile";
import { GameContextType, Tetrimino } from "../constants/types";
import tetriminos from "../constants/tetriminos";

let GameContext: Context<{}> = createContext({});

class Game extends Component<{}> {
  private gameContextValue: GameContextType = {
    screenDim: [10, 20],
    tileSize: 30,
    tiles: [],
    tileUpdateFunctions: [],
  };
  private fallingTetrimino: {
    position: [number, number];
    rotation: number;
    tetrimino: { shape: Tetrimino; color: number };
  };
  private fallingRate: number = 1;
  private speedLevel: number = 1;
  private fallingInterval: NodeJS.Timeout;
  private playTime: number = 0;
  private timeToDrop: number | undefined;
  private tetriminos: { shape: Tetrimino; color: number }[] = tetriminos;

  public constructor(props: {}) {
    super(props);

    this.fallingTetrimino = {
      position: [5, 20],
      rotation: 0,
      tetrimino:
        this.tetriminos[Math.floor(Math.random() * this.tetriminos.length)],
    };

    let i: number;
    let j: number;
    let fallingTetrimino: Tetrimino = this.getFallingTetrimino();

    for (i = 0; i < this.gameContextValue.screenDim[0]; i++) {
      this.gameContextValue.tiles.push([]);
      for (j = 0; j < this.gameContextValue.screenDim[1]; j++) {
        this.gameContextValue.tiles[i].push(0);
      }
    }

    for (i = 0; i < this.fallingTetrimino.tetrimino.shape.length; i++) {
      this.gameContextValue.tiles[fallingTetrimino[i][0]][
        fallingTetrimino[i][1]
      ] = this.fallingTetrimino.tetrimino.color;
    }

    Tile.contextType = GameContext;

    document.addEventListener("keydown", (event) => {
      this.keyDownEventHandler(event);
    });
    document.addEventListener("keyup", (event) => {
      this.keyUpEventHandler(event);
    });

    this.setFallingRate(this.fallingRate);
  }

  private setFallingRate(n: number): void {
    this.fallingRate = n;
    clearInterval(this.fallingInterval);
    this.fallingInterval = setInterval(() => {
      this.moveFallingTetrimino([0, -1, 0]);
      this.playTime += 1000 / this.fallingRate;
    }, 1000 / this.fallingRate);
  }

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
    let touchingOtherTiles: boolean = false;
    let tetriminoHasMoved: boolean = true;

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

    //Make tetrimino land
    if (tetriminoTouchedDown) {
      if (this.playTime >= this.timeToDrop && this.timeToDrop) {
        for (i = 0; i < fallingTetrimino.length; i++) {
          this.gameContextValue.tiles[fallingTetrimino[i][0]][
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
      this.gameContextValue.tiles[fallingTetrimino[i][0]][
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
    }

    lineLocations.sort();

    //Make fallen tetriminos fall into cleared lines
    if (lineLocations.length > 0) {
      let linesProcessed: number = 0;

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

    //Tell tiles to rerender if needed
    for (i = 0; i < this.gameContextValue.tileUpdateFunctions.length; i++) {
      this.gameContextValue.tileUpdateFunctions[i]();
    }
  }

  private startSoftDrop(): void {
    this.setFallingRate(15);
  }

  private endSoftDrop(): void {
    this.setFallingRate(this.speedLevel);
  }

  private keyDownEventHandler(event: KeyboardEvent): void {
    if (!event.repeat) {
      switch (event.key.toUpperCase()) {
        case "D": {
          this.moveFallingTetrimino([1, 0, 0]);
          break;
        }
        case "A": {
          this.moveFallingTetrimino([-1, 0, 0]);
          break;
        }
        case "S": {
          this.startSoftDrop();
          break;
        }
        case "ARROWRIGHT": {
          this.moveFallingTetrimino([0, 0, 1]);
          break;
        }
        case "ARROWDOWN": {
          this.moveFallingTetrimino([0, 0, -1]);
          break;
        }
      }
    }
  }

  private keyUpEventHandler(event: KeyboardEvent): void {
    switch (event.key.toUpperCase()) {
      case "S": {
        this.endSoftDrop();
      }
    }
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

export default Game;

export { GameContext };
