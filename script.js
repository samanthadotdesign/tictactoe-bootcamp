// ========== GLOBAL VARIABLES =============
// keep data about the game in a 2-D array
const board = [];
const boardSize = 3;

const emptyArray = (arr) => arr.splice(0, arr.length);

const emptyBoard = () => {
  // empty board if there is something inside
  emptyArray(board);
  // create
  // board = [
  //   ["", "", ""],
  //   ["", "", ""],
  //   ["", "", ""],
  // ];
  // reset all the 0
  emptyArray(playerXRows);
  emptyArray(playerXCols);
  emptyArray(playerORows);
  emptyArray(playerOCols);

  for (i = 0; i < boardSize; i += 1) {
    board.push([]);

    for (j = 0; j < boardSize; j += 1) {
      board[i].push("");
    }
  }
  return board;
};

// the element that contains the rows and squares
let boardElement;

// the element that contains the entire board
// we can empty it out for convenience
let boardContainer;

// current player global starts at X
let currentPlayer = "X";

const scoresDiv = document.querySelector(".scores-div");
const buttonsDiv = document.querySelector(".buttons");
const restartBtnTag = document.querySelector(".restart-btn");

// ========== HELPER FUNCTIONS =============

// Print instructions on the display
const instructionsTag = document.querySelector("h2.instructions-text");
const instructions = (message) => (instructionsTag.innerHTML = message);

// Takes in the coordinates of the squares and add a new border class
const styleSquare = (element, row, column) => {
  if (
    (row === 0 && column === 2) ||
    (row === 1 && column === 2) ||
    (row === 2 && column === 2)
  ) {
    element.classList.add("no-right");
  }
  if (
    (row === 2 && column === 0) ||
    (row === 2 && column === 1) ||
    (row === 2 && column === 2)
  ) {
    element.classList.add("no-bottom");
  }
};

// completely rebuilds the entire board every time there's a click
const buildBoard = (board) => {
  // start with an empty container
  boardContainer.innerHTML = "";
  boardElement = document.createElement("div");
  boardElement.classList.add("board");

  // move through the board data array and create the
  // current state of the board
  for (let i = 0; i < board.length; i += 1) {
    // separate var for one row / row element
    const row = board[i];
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");

    // set each square
    // j is the column number
    for (let j = 0; j < row.length; j += 1) {
      // one square element
      const square = document.createElement("div");
      square.classList.add("square");

      // set the text of the square according to the array
      square.innerText = board[i][j];

      // style the squares here
      styleSquare(square, i, j);
      rowElement.appendChild(square);

      // set the click all over again
      // eslint-disable-next-line

      square.addEventListener("click", () => {
        squareClick(i, j);
      });
    }
    // add a single row to the board
    boardContainer.appendChild(rowElement);
  }
};

// ========== GAME INITIALIZATION LOGIC =============
const gameContainer = document.querySelector("div.game");

// create the board container element and put it on the screen
const initGame = () => {
  restartBtnTag.style.display = "none";
  emptyBoard();
  boardContainer = document.createElement("div");
  boardContainer.classList.add("board");
  gameContainer.appendChild(boardContainer);

  buttonsDiv.style.display = "grid";
  // build the board - right now it's empty
  buildBoard(board);
};

// ========== GAMEPLAY LOGIC =============
// switch the global values from one player to the next
const togglePlayer = () => {
  if (currentPlayer === "X") {
    currentPlayer = "O";
  } else {
    currentPlayer = "X";
  }
};

const squareClick = (row, column) => {
  console.log("coordinates ", row, column);

  // see if the clicked square has been clicked on before
  if (board[row][column] === "") {
    // alter the data array, set it to the current player
    board[row][column] = currentPlayer;
    // push the rows & columns into the respective arrays
    if (currentPlayer === "X") {
      playerXRows.push(row);
      console.log("playerXRows ", playerXRows);
      playerXCols.push(column);
      console.log("playerXCols ", playerXCols);
      // check for array.length
      if (
        playerXRows.length >= board.length ||
        playerXCols.length >= board.length
      ) {
        checkWin(playerXRows, playerXCols, currentPlayer);
      }
    } else {
      playerORows.push(row);
      console.log("playerORows ", playerORows);
      playerOCols.push(column);
      console.log("playerOCols ", playerOCols);
      if (
        playerORows.length >= board.length ||
        playerOCols.length >= board.length
      ) {
        checkWin(playerORows, playerOCols, currentPlayer);
      }
    }
    buildBoard(board);
    togglePlayer();
  }
};

// ========== WINNING LOGIC =============

// stores scores as numbers so we can increment it
let playerXScore = 0;
let playerOScore = 0;

// when we identify the winner, we want to change add score to that winner + print the instructions + reset the game to restart
const winner = (player) => {
  // variables to display scores
  const playerXScoreTag = document.querySelector("p.player-x-score");
  const playerOScoreTag = document.querySelector("p.player-o-score");

  // if "X" === "X"
  if (player === "X") {
    playerXScore += 1;
    console.log("playerXscore is " + playerXScore);
    instructions("X wins");
    playerXScoreTag.innerHTML = playerXScore;
  } else if (player === "O") {
    playerOScore += 1;
    instructions("O wins");
    console.log("playerOscore is " + playerOScore);
    playerOScoreTag.innerHTML = playerOScore;
  }
  console.log("winner function ran");
};

// for every click on the board, store the row value in player's row array & store the column value in the player's column array
const playerXRows = [];
const playerXCols = [];
const playerORows = [];
const playerOCols = [];
// push row & column inside respective columns

// allEqual tests whether elements in the array pass the test provided in a function
const allEqual = (arr) => {
  for (i = 0; i < arr.length; i += 1) {
    if (arr[i] !== arr[0]) {
      return false;
    }
  }
  return true;
};

// compares if the arrays contain the values from each other (no need to sort)
const containsAll = (arr1, arr2) =>
  arr2.every((arr2Item) => arr1.includes(arr2Item));

// Everything in arr2 is in arr1 & Everything in arr1 is in arr2
const sameMembers = (arr1, arr2) =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1);

// only compare when the array reaches board.length
const checkWin = (rowArray, columnArray, player) => {
  console.log("check win function ran");
  // for horizontal win, all the row numbers will be the same for the board.length
  // for vertical win, all the col numbers will be the same for the board.length
  // for diagonal win, if row & column arrays match, it is a win
  if (
    allEqual(rowArray) === true ||
    allEqual(columnArray) === true ||
    sameMembers(rowArray, columnArray) === true
  ) {
    winner(player);
  }
};

// ========== USER PLAYS THE GAME =============
initGame();

const replayBtnTag = document.querySelector(".replay-btn");
replayBtnTag.addEventListener("click", () => {
  // clear out the old board first;
  boardContainer = document.querySelector("div.board");
  gameContainer.removeChild(boardContainer);
  instructions("");
  emptyBoard();
  initGame();
});

const endBtnTag = document.querySelector(".end-btn");
endBtnTag.addEventListener("click", () => {
  gameContainer.removeChild(boardContainer);
  buttonsDiv.style.display = "none";
  declareWinner();
  instructionsTag.style.height = "2em";
  scoresDiv.style.marginBottom = "1em";
  restartBtnTag.style.display = "block";
});

const declareWinner = () => {
  if (playerXScore > playerOScore) {
    instructions("X wins");
  } else if (playerOScore > playerXScore) {
    instructions("O wins");
  } else if (playerXScore === playerOScore) {
    instructions("X + O draw");
  }
};
