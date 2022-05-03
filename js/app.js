const BOARD_SIZE = 8;
const WHITE_PLAYER = "white";
const BLACK_PLAYER = "black";

const WHITE_MOVE_DIRECTION = 1;
const BLACK_MOVE_DIRECTION = -1;

const PAWN = "pawn";
const QUEEN = "queen";
const CHECKERS_BOARD_ID = "checkers-board";

let game;
let table;
let selectedPiece;

let WHITE_PIECES;
let BLACK_PIECES;

function tryUpdateSelectedPiece(row, col) {
  // Clear all previous possible moves
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove("possible-move");
      table.rows[i].cells[j].classList.remove("selected");
    }
  }

  // Show possible moves
  const piece = game.boardData.getPiece(row, col);

  if (piece !== undefined) {
    possibleMoves = game.getPossibleMoves(piece);
    for (let possibleMove of possibleMoves) {
      const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
      cell.classList.add("possible-move");
    }
  }

  table.rows[row].cells[col].classList.add("selected");
  selectedPiece = piece;
}

function onCellClick(row, col) {
  // selectedPiece - The current selected piece (selected in previous click)
  // row, col - the currently clicked cell - it may be empty, or have a piece.
  if (selectedPiece !== undefined && game.tryMove(selectedPiece, row, col)) {
    selectedPiece = undefined;
    // Recreate whole board - this is not efficient, but doesn't affect user experience
    createCheckersBoard(game.boardData);
  } else {
    tryUpdateSelectedPiece(row, col);
  }
}

// Adds an image to cell with the piece's image
function addImage(cell, player, name) {
  const image = document.createElement("img");
  image.src = "images/" + player + "/" + name + ".png";
  image.draggable = false;
  cell.appendChild(image);
}

// Initialize the board
function createCheckersBoard(boardData) {
  table = document.getElementById(CHECKERS_BOARD_ID);

  if (table !== null) {
    table.remove();
  }

  // Create empty checkers board HTML:
  table = document.createElement("table");
  table.id = CHECKERS_BOARD_ID;
  document.body.appendChild(table);
  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowElement = table.insertRow();
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = rowElement.insertCell();
      if ((row + col) % 2 === 0) {
        cell.className = "light-cell";
      } else {
        cell.className = "dark-cell";
      }
      cell.addEventListener("click", () => onCellClick(row, col));
    }
  }

  // Add pieces images to board
  for (let piece of boardData.pieces) {
    const cell = table.rows[piece.row].cells[piece.col];
    addImage(cell, piece.player, piece.type);
  }

  if (game.winner !== undefined) {
    const winnerPopup = document.createElement("div");
    const winner = game.winner.charAt(0).toUpperCase() + game.winner.slice(1);
    winnerPopup.textContent = winner + " player wins!";
    winnerPopup.classList.add("winner-dialog");
    table.appendChild(winnerPopup);
  }
}

// ************************************************************************************

// Checkes if a cell is empty
function isEmpty(div) {
  return (
    !div.classList.contains(BLACK_PLAYER) &&
    !div.classList.contains(WHITE_PLAYER)
  );
}

// Delete the class from the cell => Removing a captured piece
function resetPieceHolder(div) {
  div.classList.remove(...div.classList);
  div.innerHTML = "";
}

// Changes the turns between the white and black player
function changeTurn(color) {
  blacks = document.querySelectorAll(".black");
  whites = document.querySelectorAll(".white");

  //Remove or add the disabled class, depending on which color just played
  if (color === WHITE_PLAYER) {
    for (whitePiece of whites) {
      whitePiece.classList.add("disabled");
      whitePiece.addEventListener("click", onPieceClicked);
    }

    for (blackPiece of blacks) {
      blackPiece.classList.remove("disabled");
      blackPiece.classList.add("active");
      blackPiece.addEventListener("click", onPieceClicked);
    }
  } else {
    for (whitePiece of whites) {
      whitePiece.classList.remove("disabled");
      whitePiece.classList.add("active");
      whitePiece.addEventListener("click", onPieceClicked);
    }

    for (blackPiece of blacks) {
      blackPiece.classList.add("disabled");
      blackPiece.addEventListener("click", onPieceClicked);
    }
  }
}

// Adds the player images to the board
function addImageNew(pieceHolder, player, name) {
  const image = document.createElement("img");
  image.src = "images/" + player + "/" + name + ".png";
  image.draggable = false;
  pieceHolder.appendChild(image);
}

function getPossibleMoves(color, row, cell) {
  const moves = [];
  const realRow = row + 1;
  const realCell = cell + 1;

  if (color === WHITE_PLAYER) {
    const rightMove = document.querySelector(
      `tr:nth-of-type(${realRow + 1}) td:nth-of-type(${realCell + 1}) div`
    );

    const leftMove = document.querySelector(
      `tr:nth-of-type(${realRow + 1}) td:nth-of-type(${realCell - 1}) div`
    );

    if (rightMove && isEmpty(rightMove)) {
      moves.push({
        position: rightMove.parentElement,
        eat: { state: false, pos: null },
      });
    } else if (rightMove && rightMove.classList.contains(BLACK_PLAYER)) {
      const next = document.querySelector(
        `tr:nth-of-type(${realRow + 2}) td:nth-of-type(${realCell + 2}) div`
      );
      if (next && isEmpty(next)) {
        moves.push({
          position: next.parentElement,
          eat: {
            state: true,
            pos: rightMove,
          },
        });
      }
    }

    if (leftMove && isEmpty(leftMove)) {
      moves.push({
        position: leftMove.parentElement,
        eat: { state: false, pos: null },
      });
    } else if (leftMove && leftMove.classList.contains(BLACK_PLAYER)) {
      const next = document.querySelector(
        `tr:nth-of-type(${realRow + 2}) td:nth-of-type(${realCell - 2}) div`
      );

      if (next && isEmpty(next)) {
        moves.push({
          position: next.parentElement,
          eat: {
            state: true,
            pos: leftMove,
          },
        });
      }
    }
  } else {
    const rightMove = document.querySelector(
      `tr:nth-of-type(${realRow - 1}) td:nth-of-type(${realCell + 1}) div`
    );

    const leftMove = document.querySelector(
      `tr:nth-of-type(${realRow - 1}) td:nth-of-type(${realCell - 1}) div`
    );

    if (rightMove && isEmpty(rightMove)) {
      moves.push({
        position: rightMove.parentElement,
        eat: { state: false, pos: null },
      });
    } else if (rightMove && rightMove.classList.contains(WHITE_PLAYER)) {
      const next = document.querySelector(
        `tr:nth-of-type(${realRow - 2}) td:nth-of-type(${realCell + 2}) div`
      );

      if (isEmpty(next)) {
        moves.push({
          position: next.parentElement,
          eat: {
            state: true,
            pos: rightMove,
          },
        });
      }
    }

    if (leftMove && isEmpty(leftMove)) {
      moves.push({
        position: leftMove.parentElement,
        eat: { state: false, pos: null },
      });
    } else if (leftMove && leftMove.classList.contains(WHITE_PLAYER)) {
      const next = document.querySelector(
        `tr:nth-of-type(${realRow - 2}) td:nth-of-type(${realCell - 2}) div`
      );

      if (isEmpty(next)) {
        moves.push({
          position: next.parentElement,
          eat: {
            state: true,
            pos: leftMove,
          },
        });
      }
    }
  }

  return moves;
}

function onMoveEvent(event, prevPos, otherOptions, color, eat) {
  event.target.classList.remove("possible-move");
  event.target.onclick = null;

  //Remove the previous position
  // prevPos
  prevPos.parentElement.classList.remove(...prevPos.parentElement.classList);
  prevPos.parentElement.innerHTML = "";
  // prevPos.parentElement.onclick = null;

  for (option of otherOptions) {
    if (option.position.classList.contains("possible-move")) {
      option.position.classList.remove("possible-move");
      option.position.onclick = null;
    }
  }

  if (eat.state) {
    resetPieceHolder(eat.pos);

    const isWhite = color === WHITE_PLAYER;
    pieces = document.querySelectorAll(
      `.${isWhite ? BLACK_PLAYER : WHITE_PLAYER}`
    );

    if (pieces.length === 0) {
      alert(`${color} WON!!!!`);
    }
  }

  addImageNew(event.target.firstChild, color, PAWN);
  event.target.firstChild.classList.add(color);
  changeTurn(color);
}

function onPieceClicked(event) {
  event.target.classList.toggle("selected-piece");

  const color = event.target.src.includes("white")
    ? WHITE_PLAYER
    : BLACK_PLAYER;

  if (color === WHITE_PLAYER) {
    whites = document.querySelectorAll(".white");
    for (whitePiece of whites) {
      whitePiece.classList.toggle("disabled");
    }
  } else {
    blacks = document.querySelectorAll(".black");
    for (blackPiece of blacks) {
      blackPiece.classList.toggle("disabled");
    }
  }
  event.target.parentElement.classList.toggle("disabled");

  let cell = event.path[2].cellIndex;
  let row = event.path[3].rowIndex;

  const moves = getPossibleMoves(color, row, cell);

  for (move of moves) {
    // if true Clean prev moves
    // else show current moves
    if (move.position.classList.contains("possible-move")) {
      move.position.classList.remove("possible-move");
    } else {
      move.position.classList.add("possible-move");
      const eat = move.eat;
      move.position.onclick = (moveEvent) => {
        onMoveEvent(moveEvent, event.target, moves, color, eat);
      };
    }
  }
}

// Creates empty checkers board HTML:
function createCheckersBoardNew() {
  table = document.getElementById(CHECKERS_BOARD_ID);

  // Create empty checkers board HTML:
  table = document.createElement("table");
  table.id = CHECKERS_BOARD_ID;
  document.body.appendChild(table);

  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowElement = table.insertRow();
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = rowElement.insertCell();
      if ((row + col) % 2 === 0) {
        cell.innerHTML = "<div></div>";
        cell.className = "dark-cell";
      } else {
        cell.className = "light-cell";
      }
    }
  }

  whites = document.querySelectorAll("tr:nth-child(-n+3) div");
  blacks = document.querySelectorAll("tr:nth-child(n+6) div");

  for (whitePiece of whites) {
    addImageNew(whitePiece, WHITE_PLAYER, PAWN);
    whitePiece.classList.add("active", WHITE_PLAYER);
    whitePiece.addEventListener("click", onPieceClicked);
  }

  for (blackPiece of blacks) {
    addImageNew(blackPiece, BLACK_PLAYER, PAWN);
    blackPiece.classList.add("disabled", BLACK_PLAYER);
    blackPiece.addEventListener("click", onPieceClicked);
  }
}

function initGame() {
  //game = new Game(WHITE_PLAYER);
  //createCheckersBoard(game.boardData);
  createCheckersBoardNew();
}

// Initializing Head + Intro
window.addEventListener("load", (event) => {
  let head1 = document.createElement("h1");
  head1.textContent = "Checkers Game";
  let Body1 = document.body;
  Body1.appendChild(head1);
  let head2 = document.createElement("h2");
  head2.textContent =
    "Checkers, also called draughts, board game, one of the world's oldest games. Checkers is played by two persons who oppose each other across a board of 64 light and dark squares, the same as a chessboard.";
  let Body2 = document.body;
  Body2.appendChild(head2);
});

// Initializing Board
window.addEventListener("load", initGame);

// Credit
window.addEventListener("load", (event) => {
  let head3 = document.createElement("h3");
  head3.textContent = "© 2022 Naor Nahum";
  let Body3 = document.body;
  Body3.appendChild(head3);
});
