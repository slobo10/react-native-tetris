import { Component, ReactNode, Context } from "react";
import { Rect } from "react-native-svg";
import { BlockProps, BlockState, GameContextType } from "../constants/types";
import { colors } from "../constants/styles";

class Block extends Component<BlockProps, BlockState> {
  static contextType: Context<{}>;
  static state: { thisBlock: number };
  private GameContextValue: GameContextType;

  public constructor(
    props: { coordinates: [number, number] },
    context: GameContextType
  ) {
    super(props);

    context.blockUpdateFunctions.push(() => {
      if (
        this.state.thisBlock !=
        this.GameContextValue.blocks[this.props.coordinates[0]][
          this.props.coordinates[1]
        ]
      ) {
        this.setState({
          thisBlock:
            this.GameContextValue.blocks[this.props.coordinates[0]][
              this.props.coordinates[1]
            ],
        });
      }
    });

    this.state = {
      thisBlock:
        context.blocks[this.props.coordinates[0]][this.props.coordinates[1]],
    };

    this.GameContextValue = context;
  }

  public render(): ReactNode {
    console.log(
      "Block " +
        this.props.coordinates[0] +
        "," +
        this.props.coordinates[1] +
        " rendered!"
    );

    if (this.state.thisBlock) {
      return (
        <Rect
          x={this.props.coordinates[0] * this.GameContextValue.blockSize}
          y={
            (this.GameContextValue.screenDim[1] -
              this.props.coordinates[1] -
              1) *
            this.GameContextValue.blockSize
          }
          width={this.GameContextValue.blockSize}
          height={this.GameContextValue.blockSize}
          fill={colors[this.state.thisBlock]}
          stroke={"black"}
          strokeWidth={1}
        />
      );
    }
  }
}

export default Block;
