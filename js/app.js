let table;

function disablePiece(piece) {
  piece.classList.add("unclickable");
  piece.addEventListener("click", onPieceClicked);
}

function activatePiece(piece) {
  piece.classList.remove("unclickable");
  piece.classList.add("active");
  piece.addEventListener("click", onPieceClicked);
}

// Changes the turns between the white and black player
function changeTurn(color) {
  blacks = document.querySelectorAll(".black");
  whites = document.querySelectorAll(".white");

  // Depending ot the player that played we reset the pieces
  if (color === WHITE_PLAYER) {
    for (whitePiece of whites) {
      disablePiece(whitePiece);
    }

    for (blackPiece of blacks) {
      activatePiece(blackPiece);
    }
  } else {
    for (whitePiece of whites) {
      activatePiece(whitePiece);
    }

    for (blackPiece of blacks) {
      disablePiece(blackPiece);
    }
  }

  const oppositeColor = color === WHITE_PLAYER ? BLACK_PLAYER : WHITE_PLAYER;
  const pieces = document.querySelectorAll(`.${oppositeColor}:not(.${STUCK})`);

  if (pieces.length === 0) {
    const winnerPopup = document.createElement("div");
    winnerPopup.textContent = color + " player wins!";
    winnerPopup.classList.add("winner-dialog");
    table.appendChild(winnerPopup);
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

// Return all possible moves that the piece can do
function getPossibleMoves(color, row, cell) {
  const moves = [];
  const realRow = row + 1;
  const realCell = cell + 1;

  if (color === WHITE_PLAYER) {
    // Gets the two potential moves
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
      // potential is blocked and we check if we can eat
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
      // potential is blocked and we check if we can eat
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
    // Gets the two potential moves
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
      // potential is blocked and we check if we can eat
      const next = document.querySelector(
        `tr:nth-of-type(${realRow - 2}) td:nth-of-type(${realCell + 2}) div`
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
    } else if (leftMove && leftMove.classList.contains(WHITE_PLAYER)) {
      // potential is blocked and we check if we can eat
      const next = document.querySelector(
        `tr:nth-of-type(${realRow - 2}) td:nth-of-type(${realCell - 2}) div`
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
  }

  const isContainEat = moves.find((x) => x.eat.state === true);

  // If moves contain eat moves reutn only eat moves
  if (isContainEat) {
    return moves.filter((x) => x.eat.state === true);
  }

  // Return all moves
  return moves;
}

// Event handle for whhen player moved into the possible move given
function onMoveEvent(posToMove, prevPosDiv, allMoves, color, eat) {
  // Reset the previous div
  emptyElement(prevPosDiv);

  // Clean all visual of moves
  for (move of allMoves) {
    if (move.position.classList.contains("possible-move")) {
      move.position.classList.remove("possible-move");
      move.position.onclick = null;
    }
  }

  // If it is eat move we eat the piece
  if (eat.state) {
    emptyElement(eat.pos);
  }

  const row = posToMove.path[1].rowIndex;

  // If piece reached the end we mark it as stuck
  if (row === 0 || row === 7) {
    posToMove.target.firstChild.classList.add(STUCK);
  }

  addImage(posToMove.target.firstChild, color, PAWN);
  posToMove.target.firstChild.classList.add(color);
  changeTurn(color);
}

// Event Handle for when a player press a piece
function onPieceClicked(event) {
  // highlight the piece to move
  event.target.classList.toggle("selected-piece");

  // extract the player color
  const color = event.target.classList.contains(WHITE_PLAYER)
    ? WHITE_PLAYER
    : BLACK_PLAYER;

  // we disable other piece except the one we playing
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

  // Extract the current poistion of the piece
  let cell = event.path[1].cellIndex;
  let row = event.path[2].rowIndex;

  const moves = getPossibleMoves(color, row, cell);

  // Register event for move cells
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

  // Select the 3 bottom rows and top 3 raw to init withe piecs
  let whiteDivs = document.querySelectorAll("tr:nth-child(-n+3) div");
  let blackDivs = document.querySelectorAll("tr:nth-child(n+6) div");

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
window.addEventListener("load", createCheckersBoard);

// Credit
window.addEventListener("load", (event) => {
  let head3 = document.createElement("h3");
  head3.textContent = "© 2022 Naor Nahum";
  let Body3 = document.body;
  Body3.appendChild(head3);
});
