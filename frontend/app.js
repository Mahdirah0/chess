const boardElement = document.querySelector('.board');

const playAsWhiteButton = document.querySelector('.play-as-white');
const playAsBlackButton = document.querySelector('.play-as-black');
const playAsText = document.querySelector('.play-as-text');

import { createBoard, renderBoard } from './modules/board.js';
import {
  generateKnightMoves,
  generateBishopMoves,
  generateRookMoves,
  generatePawnMoves,
  generateKingMoves,
} from './modules/generatePieceMoves.js';
import { ENEMY_PIECE_COL, NEUTRAL_PIECE_COL, ROW, COL } from './constant.js';

const board = Array.from(Array(ROW), () =>
  new Array(COL).fill({
    letter: '',
    pathToIcon: '',
    color: '',
  })
);

let gameColorTurn = 'white';
let playerColor = '';

let userSelection = {
  row: -1,
  col: -1,
  letter: '',
  selected: false,
  color: '',
};

let validPieceMoves = [];

const switchColorTurn = () => {
  if (gameColorTurn === 'white') {
    gameColorTurn = 'black';
  } else {
    gameColorTurn = 'white';
  }
};

const move = (tRow, tCol) => {
  const { row, col } = userSelection;

  if (!userSelection.selected) return;

  const currentPiece = board[row][col];

  validPieceMoves.splice(0, validPieceMoves.length);

  // updating board game

  board[tRow][tCol] = {
    letter: currentPiece.letter,
    pathToIcon: currentPiece.pathToIcon,
    color: currentPiece.color,
    direction: currentPiece.direction,
  };

  board[row][col] = {
    letter: '',
    pathToIcon: '',
    color: '',
    direction: currentPiece.direction,
  };

  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }

  renderBoard(board, boardElement);
  addColListener();

  userSelection = {
    row: -1,
    col: -1,
    color: '',
    letter: '',
    selected: false,
  };
};

const displaySquareMove = (pos, bgColor) => {
  if (bgColor === ENEMY_PIECE_COL) {
    const enemyDiv = document.querySelector(`div[pos="${pos}"]`);
    enemyDiv.style.backgroundColor = bgColor;
    enemyDiv.setAttribute('selected', 'true');
    return;
  }

  const legalMovesDiv = document.querySelectorAll(`div[pos="${pos}"]`);
  legalMovesDiv.forEach((item) => {
    const circle = document.createElement('div');
    circle.setAttribute('selected', 'true');
    circle.style.height = '25px';
    circle.style.width = '25px';
    circle.style.backgroundColor = bgColor;
    circle.style.borderRadius = '50%';
    circle.style.pointerEvents = 'none';
    item.append(circle);
  });
};

const showValidMoves = () => {
  const { row, col } = userSelection;

  const currentDiv = document.querySelector(`div[pos="${row}-${col}"]`);
  currentDiv.style.backgroundColor = 'green';

  validPieceMoves.forEach((move) => {
    const pos = `${move.row}-${move.col}`;

    if (move.enemy) {
      displaySquareMove(pos, ENEMY_PIECE_COL);
    } else {
      displaySquareMove(pos, NEUTRAL_PIECE_COL);
    }
  });
};

const generateMove = () => {
  const { letter } = userSelection;

  if (letter.toLowerCase() === 'r') {
    validPieceMoves = generateRookMoves(board, userSelection);
  } else if (letter.toLowerCase() === 'k') {
    validPieceMoves = generateKnightMoves(board, userSelection);
  } else if (letter.toLowerCase() === 'b') {
    validPieceMoves = generateBishopMoves(board, userSelection);
  } else if (letter.toLowerCase() === 'q') {
    validPieceMoves = generateRookMoves(board, userSelection);
    validPieceMoves = generateBishopMoves(board, userSelection);
  } else if (letter.toLowerCase() === 'p') {
    validPieceMoves = generatePawnMoves(board, userSelection);
  } else if (letter.toLowerCase() === 'ki') {
    validPieceMoves = generateKingMoves(board, userSelection);
  }
};

const isMoveLegal = (tRow, tCol) => {
  for (let i = 0; i < validPieceMoves.length; i++) {
    if (validPieceMoves[i].row === tRow && validPieceMoves[i].col === tCol) {
      return true;
    }
  }
};

const handleClick = (e) => {
  // getting clicked element information
  const pos = e.target.attributes.pos.value;
  const clickedRow = parseInt(pos[0]);
  const clickedCol = parseInt(pos[2]);
  const { letter, color } = board[clickedRow][clickedCol];

  let sameTeam = userSelection.color === color;
  let samePiece =
    userSelection.row === clickedRow && userSelection.col === clickedCol;

  if (sameTeam) {
    while (boardElement.firstChild) {
      boardElement.removeChild(boardElement.firstChild);
    }

    validPieceMoves.splice(0, validPieceMoves.length);
    renderBoard(board, boardElement);
    addColListener();
  }

  if (samePiece && userSelection.selected) {
    while (boardElement.firstChild) {
      boardElement.removeChild(boardElement.firstChild);
    }

    renderBoard(board, boardElement);
    addColListener();
    userSelection.selected = false;
    validPieceMoves.splice(0, validPieceMoves.length);
  } else if (gameColorTurn === color) {
    userSelection = {
      row: clickedRow,
      col: clickedCol,
      letter,
      color,
      selected: true,
    };
    generateMove();
    showValidMoves();
  } else if (userSelection.selected) {
    if (isMoveLegal(clickedRow, clickedCol)) {
      move(clickedRow, clickedCol);
      switchColorTurn();
    }
  }
};

const addColListener = () => {
  const cols = document.querySelectorAll('.col');

  cols.forEach((col) => {
    col.addEventListener('click', handleClick);
  });
};

const main = () => {
  playerColor = 'white';
  createBoard(board, playerColor);
  renderBoard(board, boardElement);
  addColListener();
};

main();

const hideHTMLButtons = () => {
  playAsWhiteButton.style.display = 'none';
  playAsBlackButton.style.display = 'none';
  playAsText.style.display = 'none';
};

playAsWhiteButton.addEventListener('click', () => {
  playerColor = 'white';
  hideHTMLButtons();

  main();
});

playAsBlackButton.addEventListener('click', () => {
  playerColor = 'black';
  hideHTMLButtons();

  main();
});
