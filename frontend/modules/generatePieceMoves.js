import { ROW, COL } from './board.js';
import { board } from './board.js';

const validMoves = [];

const isPieceWhite = (color) => {
  return color === 'white';
};

export const isSquareValid = (row, col, pieceColor) => {
  const { letter, color } = board[row][col];
  const enemyColor = isPieceWhite(color);

  if (letter === '') {
    validMoves.push({ row, col, enemy: false });
    return;
  }

  if (pieceColor !== enemyColor) {
    validMoves.push({ row, col, enemy: true });
    return true;
  }

  return true;
};

export const generateRookMoves = (selection) => {
  const { row, col, color } = selection;
  const isWhite = isPieceWhite(color);

  for (let i = col + 1; i < COL; i++) {
    if (isSquareValid(row, i, isWhite)) {
      break;
    }
  }

  // left col
  for (let i = col - 1; i >= 0; i--) {
    if (isSquareValid(row, i, isWhite)) {
      break;
    }
  }

  // row down
  for (let i = row + 1; i < ROW; i++) {
    if (isSquareValid(i, col, isWhite)) {
      break;
    }
  }

  // row up
  for (let i = row - 1; i >= 0; i--) {
    if (isSquareValid(i, col, isWhite)) {
      break;
    }
  }

  return validMoves;
};

export const generateKnightMoves = (selection) => {
  const { row, col, color } = selection;
  const isWhite = isPieceWhite(color);

  const knightMoves = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  knightMoves.forEach((move) => {
    const targetRow = move[0] + row;
    const targetCol = move[1] + col;

    if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
      isSquareValid(targetRow, targetCol, isWhite);
    }
  });

  return validMoves;
};

export const generateBishopMoves = (selection) => {
  const { row, col, color } = selection;
  const isWhite = isPieceWhite(color);

  for (let i = 1; i < ROW; i++) {
    let tempRow = row - i;
    let tempCol = col + i;

    if (tempRow < 0 || tempCol >= COL) {
      break;
    }

    if (isSquareValid(tempRow, tempCol, isWhite)) {
      break;
    }
  }

  // top left
  for (let i = 1; i < ROW; i++) {
    let tempRow = row - i;
    let tempCol = col - i;

    if (tempRow < 0 || tempCol < 0) {
      break;
    }

    if (isSquareValid(tempRow, tempCol, isWhite)) {
      break;
    }
  }

  // bottom left
  for (let i = 1; i < ROW; i++) {
    let tempRow = row + i;
    let tempCol = col - i;

    if (tempRow >= ROW || tempCol < 0) {
      break;
    }

    if (isSquareValid(tempRow, tempCol, isWhite)) {
      break;
    }
  }

  // bottom right
  for (let i = 1; i < ROW; i++) {
    let tempRow = row + i;
    let tempCol = col + i;

    if (tempRow >= ROW || tempCol >= COL) {
      break;
    }

    if (isSquareValid(tempRow, tempCol, isWhite)) {
      break;
    }
  }

  return validMoves;
};

export const generatePawnMoves = (selection) => {
  const { row, col, color } = selection;

  // if (color === playerColor && row === 6) {
  //   let tempRow2 = row - 1;
  //   let tempRow3 = row - 2;

  //   validMove.push({ row: tempRow2, col });
  //   validMove.push({ row: tempRow3, col });
  // } else if (color === playerColor) {
  //   let tempRow2 = row - 1;
  //   validMove.push({ row: tempRow2, col });
  // } else if (color === enemyColor && row === 1) {
  //   let tempRow2 = row + 1;
  //   let tempRow3 = row + 2;

  //   validMove.push({ row: tempRow2, col });
  //   validMove.push({ row: tempRow3, col });
  // } else if (color === enemyColor) {
  //   let tempRow2 = row + 1;
  //   validMove.push({ row: tempRow2, col });
  // }
};
