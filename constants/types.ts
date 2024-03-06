type GameContextType = {
  screenDim: [number, number];
  blockSize: number;
  blocks: number[][];
  blockUpdateFunctions: (() => void)[];
};

type Tetrimino = [number, number][];

type BlockProps = {
  coordinates: [number, number];
};

type BlockState = {
  thisBlock: number;
};

export { GameContextType, Tetrimino, BlockProps, BlockState };
