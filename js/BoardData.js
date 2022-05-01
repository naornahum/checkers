class BoardData {
  constructor() {
    this.initPieces();
  }

  initPieces() {
    // Create list of pieces (34 total)
    this.pieces = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if ((i == 0 || i == 2) && j % 2 == 1) {
          this.pieces.push(new Piece(i, j, PAWN, WHITE_PLAYER));
        }

        if (i == 1 && j % 2 == 0) {
          this.pieces.push(new Piece(i, j, PAWN, WHITE_PLAYER));
        }

        if ((i == 5 || i == 7) && j % 2 == 0) {
          this.pieces.push(new Piece(i, j, PAWN, BLACK_PLAYER));
        }

        if (i == 6 && j % 2 == 1) {
          this.pieces.push(new Piece(i, j, PAWN, BLACK_PLAYER));
        }
      }
    }
  }

  // Returns piece in row, col, or undefined if not exists.
  getPiece(row, col) {
    for (const piece of this.pieces) {
      if (piece.row === row && piece.col === col) {
        return piece;
      }
    }
  }

  removePiece(row, col) {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.row === row && piece.col === col) {
        // Remove piece at index i
        this.pieces.splice(i, 1);
        return piece;
      }
    }
  }

  isEmpty(row, col) {
    return this.getPiece(row, col) === undefined;
  }

  isPlayer(row, col, player) {
    const piece = this.getPiece(row, col);
    return piece !== undefined && piece.player === player;
  }
}
