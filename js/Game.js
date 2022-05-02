class Game {
  constructor(firstPlayer) {
    this.boardData = new BoardData();
    this.currentPlayer = firstPlayer;
    this.winner = undefined;
  }

  // Tries to actually make a move. Returns true if successful.
  tryMove(piece, row, col) {
    const possibleMoves = this.getPossibleMoves(piece);
    // possibleMoves looks like this: [[1,2], [3,2]]
    for (const possibleMove of possibleMoves) {
      // possibleMove looks like this: [1,2]
      if (possibleMove[0] === row && possibleMove[1] === col) {
        // There is a legal move
        this.boardData.removePiece(row, col);
        if (Math.abs(piece.row - row) === 2) {
          const rowToRemove = piece.row + (row - piece.row) / 2;

          const colToRemove = piece.col + (col - piece.col) / 2;

          this.boardData.removePiece(rowToRemove, colToRemove);
        }

        piece.row = row;
        piece.col = col;
        this.currentPlayer = piece.getOpponent();
        return true;
      }
    }
    return false;
  }

  // TODO: queen move, if we reached end of the board, check if we on edge
  getPossibleMoves(piece) {
    const moves = [];
    // In version 14+ on node ? checks first if piece is defined before checking if player is presented
    if (piece?.player === this.currentPlayer) {
      let direction = WHITE_MOVE_DIRECTION;
      if (this.currentPlayer === BLACK_PLAYER) {
        direction = BLACK_MOVE_DIRECTION;
      }

      if (!this.isPieceBlocked(piece.row + direction, piece.col + 1)) {
        moves.push([piece.row + direction, piece.col + 1]);
      } else if (
        !this.isPieceBlocked(piece.row + 2 * direction, piece.col + 2) &&
        !this.isPieceAllay(
          this.boardData.getPiece(piece.row + direction, piece.col + 1)
        )
      ) {
        moves.push([piece.row + 2 * direction, piece.col + 2]);
      }

      if (!this.isPieceBlocked(piece.row + direction, piece.col - 1)) {
        moves.push([piece.row + direction, piece.col - 1]);
      } else if (
        !this.isPieceBlocked(piece.row + 2 * direction, piece.col - 2) &&
        !this.isPieceAllay(
          this.boardData.getPiece(piece.row + direction, piece.col - 1)
        )
      ) {
        moves.push([piece.row + 2 * direction, piece.col - 2]);
      }
    }
    return moves;
  }

  isPieceBlocked(row, col) {
    return this.boardData.getPiece(row, col) !== undefined;
  }

  isPieceAllay(piece) {
    return piece.player === this.currentPlayer;
  }
}
