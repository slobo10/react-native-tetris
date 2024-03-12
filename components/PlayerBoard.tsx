import BoardBase from "./BoardBase";

class PlayerBoard extends BoardBase {
  public constructor(props: {}) {
    super(props);

    document.addEventListener("keydown", (event) => {
      this.keyDownEventHandler(event);
    });
    document.addEventListener("keyup", (event) => {
      this.keyUpEventHandler(event);
    });
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
}

export default PlayerBoard;
