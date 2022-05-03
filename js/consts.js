const BOARD_SIZE = 8;
const WHITE_PLAYER = "white";
const BLACK_PLAYER = "black";

const DIRECTIONS = [
  {
    nextRow: 1,
    nextCell: -1,
  },
  {
    nextRow: 1,
    nextCell: 1,
  },
  {
    nextRow: -1,
    nextCell: -1,
  },
  {
    nextRow: -1,
    nextCell: 1,
  },
];

const PAWN = "pawn";
const QUEEN = "queen";
const STUCK = "stuck";
const CHECKERS_BOARD_ID = "checkers-board";
