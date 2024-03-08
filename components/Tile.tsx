import { Component, ReactNode, Context } from "react";
import { Rect } from "react-native-svg";
import { TileProps, TileState, GameContextType } from "../constants/types";
import { colors } from "../constants/styles";

class Tile extends Component<TileProps, TileState> {
  static contextType: Context<{}>;
  private GameContextValue: GameContextType;
  private coords: [number, number];

  public constructor(props: TileProps, context: GameContextType) {
    super(props);

    context.tileUpdateFunctions.push(() => {
      if (
        this.state.thisTile !=
        this.GameContextValue.tiles[this.props.coordinates[0]][
          this.props.coordinates[1]
        ]
      ) {
        this.setState({
          thisTile:
            this.GameContextValue.tiles[this.props.coordinates[0]][
              this.props.coordinates[1]
            ],
        });
      }
    });

    this.state = {
      thisTile:
        context.tiles[this.props.coordinates[0]][this.props.coordinates[1]],
    };

    this.coords = [
      this.props.coordinates[0] * context.tileSize,
      (context.screenDim[1] - props.coordinates[1] - 1) * context.tileSize,
    ];

    this.GameContextValue = context;
  }

  public render(): ReactNode {
    console.log(
      "Tile " +
        this.props.coordinates[0] +
        "," +
        this.props.coordinates[1] +
        " rendered!"
    );

    if (this.state.thisTile) {
      return (
        <Rect
          x={this.coords[0]}
          y={this.coords[1]}
          width={this.GameContextValue.tileSize}
          height={this.GameContextValue.tileSize}
          fill={colors[this.state.thisTile]}
          stroke={"black"}
          strokeWidth={1}
        />
      );
    }
  }
}

export default Tile;
