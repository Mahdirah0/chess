const boardElement = document.querySelector('.board');
const button = document.querySelector('.roomButton');
const nameInput = document.querySelector('.nameInput');
const roomInput = document.querySelector('.roomInput');

import { createBoard, renderBoard, board } from './modules/board.js';
import {
  generateKnightMoves,
  generateBishopMoves,
  generateRookMoves,
  generatePawnMoves,
} from './modules/generatePieceMoves.js';

let turn = 'white';
let playerColor = '';

const ENEMY_PIECE_COL = 'red';
const NEUTRAL_PIECE_COL = '#012300';

let userSelection = {
  row: -1,
  col: -1,
  letter: '',
  selected: false,
  color: '',
};

let validMove = [];

const socket = io('http://localhost:5000/');

socket.on('move_piece', (row, col, tRow, tCol) => {
  const currentPiece = board[row][col];
  console.log(currentPiece);

  validMove.splice(0, validMove.length);

  board[tRow][tCol] = {
    letter: currentPiece.letter,
    pathToIcon: currentPiece.pathToIcon,
    color: currentPiece.color,
  };

  board[row][col] = {
    letter: '',
    pathToIcon: '',
    color: '',
  };

  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }

  renderBoard(boardElement);
  addColListener();

  userSelection = {
    row: -1,
    col: -1,
    color: '',
    letter: '',
    selected: false,
  };

  if (turn === 'white') {
    turn = 'black';
  } else {
    turn = 'white';
  }
});

const move = (tRow, tCol) => {
  const { row, col } = userSelection;
  console.log(row, col);
  console.log(tRow, tCol);

  const currentPiece = board[row][col];

  validMove.splice(0, validMove.length);

  board[tRow][tCol] = {
    letter: currentPiece.letter,
    pathToIcon: currentPiece.pathToIcon,
    color: currentPiece.color,
  };

  board[row][col] = {
    letter: '',
    pathToIcon: '',
    color: '',
  };

  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }

  renderBoard(boardElement);
  addColListener();

  userSelection = {
    row: -1,
    col: -1,
    color: '',
    letter: '',
    selected: false,
  };

  if (turn === 'white') {
    turn = 'black';
  } else {
    turn = 'white';
  }
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

const showMove = () => {
  const { row, col } = userSelection;

  const currentDiv = document.querySelector(`div[pos="${row}-${col}"]`);
  currentDiv.style.backgroundColor = 'green';

  validMove.forEach((move) => {
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
    validMove = generateRookMoves(userSelection);
  } else if (letter.toLowerCase() === 'k') {
    validMove = generateKnightMoves(userSelection);
  } else if (letter.toLowerCase() === 'b') {
    validMove = generateBishopMoves(userSelection);
  } else if (letter.toLowerCase() === 'q') {
    validMove = generateRookMoves(userSelection);
    validMove = generateBishopMoves(userSelection);
  } else if (letter.toLowerCase() === 'p') {
    validMove = generatePawnMoves(userSelection);
  }
};

const isMoveLegal = (tRow, tCol) => {
  for (let i = 0; i < validMove.length; i++) {
    if (tRow === validMove[i].row && tCol === validMove[i].col) {
      const { row, col } = userSelection;
      move(tRow, tCol);
      socket.emit('move_piece', 'room', row, col, tRow, tCol);
    }
  }
};

const handleClick = (e) => {
  const pos = e.target.attributes.pos.value;
  const row = parseInt(pos[0]);
  const col = parseInt(pos[2]);
  const { letter, color } = board[row][col];

  let samePiece = userSelection.row === row && userSelection.col === col;
  let sameTeam = userSelection.color === color;

  if (sameTeam) {
    while (boardElement.firstChild) {
      boardElement.removeChild(boardElement.firstChild);
    }

    validMove.splice(0, validMove.length);
    renderBoard(boardElement);
    addColListener();
  }

  if (samePiece && userSelection.selected) {
    while (boardElement.firstChild) {
      boardElement.removeChild(boardElement.firstChild);
    }

    renderBoard(boardElement);
    addColListener();
    userSelection.selected = false;
    validMove.splice(0, validMove.length);
  } else if (turn === color && playerColor === color) {
    userSelection = { row, col, letter, color, selected: true };
    generateMove();
    showMove();
  } else if (userSelection.selected) {
    console.log(userSelection);
    isMoveLegal(row, col);
  }
};

const addColListener = () => {
  const cols = document.querySelectorAll('.col');

  cols.forEach((col) => {
    col.addEventListener('click', handleClick);
  });
};

button.addEventListener('click', () => {
  const { value: room } = roomInput;
  const { value: name } = nameInput;

  socket.emit('join', { room, name });
});

socket.on('start_game', ({ color, opponent }) => {
  playerColor = color;
  createBoard(color);
  renderBoard(boardElement);
  addColListener();
});
