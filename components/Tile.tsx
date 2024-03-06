import { Component, ReactNode, Context } from "react";
import { Rect } from "react-native-svg";
import { TileProps, TileState, GameContextType } from "../constants/types";
import { colors } from "../constants/styles";

class Tile extends Component<TileProps, TileState> {
  static contextType: Context<{}>;
  private GameContextValue: GameContextType;

  public constructor(
    props: { coordinates: [number, number] },
    context: GameContextType
  ) {
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
          x={this.props.coordinates[0] * this.GameContextValue.tileSize}
          y={
            (this.GameContextValue.screenDim[1] -
              this.props.coordinates[1] -
              1) *
            this.GameContextValue.tileSize
          }
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
