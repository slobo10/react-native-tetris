type GameContextType = {
  screenDim: [number, number];
  tileSize: number;
  tiles: number[][];
  tileUpdateFunctions: (() => void)[];
};

type Tetrimino = [number, number][];

type TileProps = {
  coordinates: [number, number];
};

type TileState = {
  thisTile: number;
};

export { GameContextType, Tetrimino, TileProps, TileState };
