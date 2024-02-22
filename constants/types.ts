type GameContextType = {
  screenDim: [number, number];
  blockSize: number;
  blocks: boolean[][];
  blockUpdateFunctions: (() => void)[];
};

type Tetrimino = [number, number][];

type BlockProps = {
  coordinates: [number, number];
};

type BlockState = {
  thisBlock: boolean;
};

export { GameContextType, Tetrimino, BlockProps, BlockState };
