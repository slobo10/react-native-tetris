import { Tetrimino } from "./types";

const tetriminos: { color: number; shape: Tetrimino }[] = [
  //Longbar
  {
    color: 6,
    shape: [
      [0.5, 1.5],
      [0.5, 0.5],
      [0.5, -0.5],
      [0.5, -1.5],
    ],
  },
  //T
  {
    color: 7,
    shape: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [0, -1],
    ],
  },
  //L
  {
    color: 2,
    shape: [
      [1, 0],
      [0, 0],
      [-1, 0],
      [-1, -1],
    ],
  },
  //Anti-L
  {
    color: 5,
    shape: [
      [1, 0],
      [0, 0],
      [-1, 0],
      [1, -1],
    ],
  },
  //S
  {
    color: 4,
    shape: [
      [1, 1],
      [0, 1],
      [0, 0],
      [-1, 0],
    ],
  },
  //Z
  {
    color: 1,
    shape: [
      [-1, 1],
      [0, 1],
      [0, 0],
      [1, 0],
    ],
  },
  //Square
  {
    color: 3,
    shape: [
      [0.5, 0.5],
      [0.5, -0.5],
      [-0.5, -0.5],
      [-0.5, 0.5],
    ],
  },
];

export default tetriminos;
