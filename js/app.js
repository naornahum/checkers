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
const CHECKERS_BOARD_ID = "checkers-board";

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

  //Remove or add the unclickable class, depending on which color just played
  if (color === WHITE_PLAYER) {
    for (whitePiece of whites) {
      whitePiece.classList.add("unclickable");
      whitePiece.addEventListener("click", onPieceClicked);
    }

    for (blackPiece of blacks) {
      blackPiece.classList.remove("unclickable");
      blackPiece.classList.add("active");
      blackPiece.addEventListener("click", onPieceClicked);
    }
  } else {
    for (whitePiece of whites) {
      whitePiece.classList.remove("unclickable");
      whitePiece.classList.add("active");
      whitePiece.addEventListener("click", onPieceClicked);
    }

    for (blackPiece of blacks) {
      blackPiece.classList.add("unclickable");
      blackPiece.addEventListener("click", onPieceClicked);
    }
  }
}

// Adds the player images to the board
function addImage(pieceHolder, player, name) {
  const image = document.createElement("img");
  image.src = "images/" + player + "/" + name + ".png";
  image.draggable = false;
  image.className = "unclickable";
  pieceHolder.appendChild(image);
}

function getPossibleMoves(color, row, cell) {
  const moves = [];
  const realRow = row + 1;
  const realCell = cell + 1;

  // if (isQueen) {
  //   for (direction of DIRECTIONS) {
  //     let i = 1;
  //     while (
  //       realRow + i * direction.nextRow > 0 &&
  //       realRow + i * direction.nextRow < 9 &&
  //       realCell + i * direction.nextCell > 0 &&
  //       realCell + i * direction.nextCell < 9
  //     ) {
  //       const cellToMove = document.querySelector(
  //         `tr:nth-of-type(${realRow + i * direction.nextRow}) td:nth-of-type(${
  //           realCell + i * direction.nextCell
  //         }) div`
  //       );
  //       i++;

  //       cellToMove &&
  //         isEmpty(cellToMove) &&
  //         moves.push({
  //           position: cellToMove.parentElement,
  //           eat: { state: false, pos: null },
  //         });
  //     }
  //   }

  //   return moves;
  // }

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

  // Convert to boolean
  const isContainEat = moves.find((x) => x.eat.state === true);

  // If moves contain eat moves reutn only eat moves
  if (isContainEat) {
    return moves.filter((x) => x.eat.state === true);
  }

  // Return all moves
  return moves;
}

function onMoveEvent(posToMove, prevPosDiv, allMoves, color, eat) {
  posToMove.target.classList.remove("possible-move");
  posToMove.target.onclick = null;

  // Reset the previous div
  resetPieceHolder(prevPosDiv);

  // Clean all moves
  for (move of allMoves) {
    if (move.position.classList.contains("possible-move")) {
      move.position.classList.remove("possible-move");
      move.position.onclick = null;
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

  const row = posToMove.path[1].rowIndex;

  // Transform normal so queen
  // if (row === 0 || row === 7) {
  //   addImage(posToMove.target.firstChild, color, QUEEN);
  //   posToMove.target.firstChild.classList.add(QUEEN);
  // } else {
  //   addImage(posToMove.target.firstChild, color, PAWN);
  // }

  addImage(posToMove.target.firstChild, color, PAWN);

  posToMove.target.firstChild.classList.add(color);
  changeTurn(color);
}

function onPieceClicked(event) {
  event.target.classList.toggle("selected-piece");

  const color = event.target.classList.contains(WHITE_PLAYER)
    ? WHITE_PLAYER
    : BLACK_PLAYER;

  if (color === WHITE_PLAYER) {
    whites = document.querySelectorAll(".white");
    for (whitePiece of whites) {
      whitePiece.classList.toggle("unclickable");
    }
  } else {
    blacks = document.querySelectorAll(".black");
    for (blackPiece of blacks) {
      blackPiece.classList.toggle("unclickable");
    }
  }
  event.target.classList.toggle("unclickable");

  let cell = event.path[1].cellIndex;
  let row = event.path[2].rowIndex;

  // const isQueen = event.path[0].classList.contains(QUEEN);
  const moves = getPossibleMoves(color, row, cell, isQueen);

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
function createCheckersBoard() {
  let table = document.getElementById(CHECKERS_BOARD_ID);

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

  // Select the 3 bottom rows and top 3 raw to init withe piecs
  let whiteDivs = document.querySelectorAll("tr:nth-child(-n+1) div");
  let blackDivs = document.querySelectorAll("tr:nth-child(n+8) div");

  for (whitePiece of whiteDivs) {
    addImage(whitePiece, WHITE_PLAYER, PAWN);
    whitePiece.classList.add("active", WHITE_PLAYER);
    whitePiece.addEventListener("click", onPieceClicked);
  }

  for (blackPiece of blackDivs) {
    addImage(blackPiece, BLACK_PLAYER, PAWN);
    blackPiece.classList.add("unclickable", BLACK_PLAYER);
    blackPiece.addEventListener("click", onPieceClicked);
  }
}

function initGame() {
  createCheckersBoard();
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
