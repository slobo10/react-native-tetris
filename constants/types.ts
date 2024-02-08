type GameContextType = {
  screenDim: [number, number];
  blockSize: number;
  blocks: boolean[][];
};

type BlockProps = {
  coordinates: [number, number];
};

type BlockState = {
  thisBlock: boolean;
};

export { GameContextType, BlockProps, BlockState };
