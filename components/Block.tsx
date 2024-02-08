import { Component, ReactNode, Context } from "react";
import { Rect } from "react-native-svg";
import { GameContextType } from "../constants/types";

class Block extends Component<
  { coordinates: [number, number] },
  { thisBlock: boolean }
> {
  static contextType: Context<{}>;
  private GameContextValue: GameContextType;

  public constructor(
    props: { coordinates: [number, number] },
    context: GameContextType
  ) {
    super(props);

    this.state = {
      thisBlock:
        context.blocks[this.props.coordinates[0]][this.props.coordinates[1]],
    };

    this.GameContextValue = context;
  }

  public render(): ReactNode {
    if (this.state.thisBlock) {
      return (
        <Rect
          x={this.props.coordinates[0] * this.GameContextValue.blockSize}
          y={
            (this.GameContextValue.screenDim[1] - this.props.coordinates[1]) *
            this.GameContextValue.blockSize
          }
          width={this.GameContextValue.blockSize}
          height={this.GameContextValue.blockSize}
        />
      );
    }
  }
}

export default Block;
