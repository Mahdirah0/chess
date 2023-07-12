import { ROW, COL } from '../constant.js';

const validMoves = [];
const whiteKingsPosition = { row: 4, col: 5 };
const blackKingPosition = { row: 3, col: 0 };

const whiteKingAvailableSpaces = {
  topRight: true,
  middleLeft: true,
  bottomLeft: true,
  topMiddle: true,
  bottomMiddle: true,
  topRight: true,
  middleRight: true,
  bottomRight: true,
};

const blackKingAvailableSpaces = {
  topRight: true,
  middleLeft: true,
  bottomLeft: true,
  topMiddle: true,
  bottomMiddle: true,
  topRight: true,
  middleRight: true,
  bottomRight: true,
};

const isPieceWhite = (color) => {
  return color === 'white';
};

export const isSquareEmpty = (board, row, col, pieceColor) => {
  const { letter, color } = board[row][col];
  const isClickedPieceWhite = isPieceWhite(color);
  const isCurrentPieceWhite = isPieceWhite(pieceColor);

  if (letter === '') {
    validMoves.push({ row, col, enemy: false });
    return;
  }

  if (isCurrentPieceWhite !== isClickedPieceWhite) {
    validMoves.push({ row, col, enemy: true });
    return true;
  }

  return true;
};

export const generateRookMoves = (board, selection) => {
  const { row, col, color } = selection;

  for (let i = col + 1; i < COL; i++) {
    if (isSquareEmpty(board, row, i, color)) {
      break;
    }
  }

  // left col
  for (let i = col - 1; i >= 0; i--) {
    if (isSquareEmpty(board, row, i, color)) {
      break;
    }
  }

  // row down
  for (let i = row + 1; i < ROW; i++) {
    if (isSquareEmpty(board, i, col, color)) {
      break;
    }
  }

  // row up
  for (let i = row - 1; i >= 0; i--) {
    if (isSquareEmpty(board, i, col, color)) {
      break;
    }
  }

  return validMoves;
};

export const generateKnightMoves = (board, selection) => {
  const { row, col, color } = selection;

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
      isSquareEmpty(board, targetRow, targetCol, color);
    }
  });

  return validMoves;
};

export const generateBishopMoves = (board, selection) => {
  const { row, col, color } = selection;

  for (let i = 1; i < ROW; i++) {
    let tempRow = row - i;
    let tempCol = col + i;

    if (tempRow < 0 || tempCol >= COL) {
      break;
    }

    if (isSquareEmpty(board, tempRow, tempCol, color)) {
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

    if (isSquareEmpty(board, tempRow, tempCol, color)) {
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

    if (isSquareEmpty(board, tempRow, tempCol, color)) {
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

    if (isSquareEmpty(board, tempRow, tempCol, color)) {
      break;
    }
  }

  return validMoves;
};

export const generatePawnMoves = (board, selection) => {
  const { row, col, color } = selection;
  const { direction } = board[row][col];

  if (direction === 'up') {
    const isSquareAboveEmpty = board[row - 1][col].letter === '';

    if (row === 6) {
      const isFirstTwoSquareEmpty =
        board[row - 1][col].letter === '' && board[row - 2][col].letter === '';

      if (isFirstTwoSquareEmpty) {
        validMoves.push({ row: row - 2, col, enemy: false });
      }
    }
    if (isSquareAboveEmpty) {
      validMoves.push({ row: row - 1, col, enemy: false });
    }
    if (
      board[row - 1][col + 1].color !== color &&
      board[row - 1][col + 1].letter !== ''
    ) {
      validMoves.push({ row: row - 1, col: col + 1, enemy: true });
    }
    if (
      board[row - 1][col - 1].color !== color &&
      board[row - 1][col - 1].letter !== ''
    ) {
      validMoves.push({ row: row - 1, col: col - 1, enemy: true });
    }
  } else {
    const isSquareAboveEmpty = board[row + 1][col].letter === '';
    if (row === 1) {
      const isFirstTwoSquareEmpty =
        board[row + 1][col].letter === '' && board[row + 2][col].letter === '';
      if (isFirstTwoSquareEmpty) {
        validMoves.push({ row: row + 2, col, enemy: false });
      }
    }
    if (isSquareAboveEmpty) {
      validMoves.push({ row: row + 1, col, enemy: false });
    }
    if (
      board[row + 1][col + 1].color !== color &&
      board[row + 1][col + 1].letter !== ''
    ) {
      validMoves.push({ row: row + 1, col: col + 1, enemy: true });
    }
    if (
      board[row + 1][col - 1].color !== color &&
      board[row + 1][col - 1].letter !== ''
    ) {
      validMoves.push({ row: row + 1, col: col - 1, enemy: true });
    }
  }

  return validMoves;
};

const comparePieces = (board, row, col, pieceToLookFor) => {
  let piece = board[row][col];

  if (piece.letter === pieceToLookFor) {
    return true;
  } else if (piece.letter === '') {
  } else {
    return false;
  }
};

const lookForRook = (board, row, col, pieceColor) => {
  let pieceToLookFor;
  if (pieceColor === 'white') {
    pieceToLookFor = 'R';
  } else {
    pieceToLookFor = 'r';
  }

  let isPieceFound = false;

  for (let i = 1; i < 8; i++) {
    // check for up direction
    let rowUp = row - i;
    let colLeft = col - i;
    let rowDown = row + i;
    let colRight = col + i;

    // up direction
    if (rowUp >= 0 && rowUp < 8) {
      let isRookVerticallyUp = comparePieces(board, rowUp, col, pieceToLookFor);
      let piece = board[rowUp][col];
      // console.log(piece);
      console.log('up direction', rowDown, col, rowUp);

      if (piece.letter === 'R') {
        // console.log('found rook at ', rowUp, col);
        isPieceFound = true;
        break;
      } else if (piece.letter === '') {
        // console.log('currently cell is empty');
      } else {
        // console.log(piece.letter, ' piece at ', rowUp, col);
        isPieceFound = false;
        break;
      }

      if (isRookVerticallyUp) {
        isPieceFound = true;
        break;
      } else if (isRookVerticallyUp === false) {
        isPieceFound = false;
      }
    }
    // left direction
    // if (colLeft >= 0 && colLeft < 8) {
    //   let isRookHorizontallyLeft = comparePieces(
    //     board,
    //     row,
    //     colLeft,
    //     pieceToLookFor
    //   );

    //   if (isRookHorizontallyLeft) {
    //     isPieceFound = true;
    //     break;
    //   } else if (isRookHorizontallyLeft === false) {
    //     break;
    //   }
    // }
    // down direction
    if (rowDown >= 0 && rowDown < 8) {
      console.log('down direction', rowDown, col, rowUp);
      const piece = board[rowDown][col];
      if (piece.letter === 'R') {
        // console.log('found piece');
        isPieceFound = true;
        break;
      } else if (piece.letter === '') {
      } else {
        // console.log('found another');
        isPieceFound = false;
        break;
      }
      // let isRookVerticallyDown = comparePieces(
      //   board,
      //   rowDown,
      //   col,
      //   pieceToLookFor
      // );
      // console.log(rowDown, col, 'row down');
      // if (isRookVerticallyDown) {
      //   isPieceFound = true;
      //   break;
      // } else if (isRookVerticallyDown === false) {
      //   break;
      // }
    }
    // right direction
    // if (colRight >= 0 && colRight < 8) {
    //   let isRookHorizontallyRight = comparePieces(
    //     board,
    //     row,
    //     colRight,
    //     pieceToLookFor
    //   );
    //   if (isRookHorizontallyRight) {
    //     isPieceFound = true;
    //     break;
    //   } else if (isRookHorizontallyRight === false) {
    //     break;
    //   }
    // }
  }

  return isPieceFound;
};

const lookForBishop = (board, row, col, pieceColor) => {
  let pieceToLookFor;
  if (pieceColor === 'white') {
    pieceToLookFor = 'B';
  } else {
    pieceToLookFor = 'b';
  }

  let isPieceFound = false;

  for (let i = 0; i < 8; i++) {
    // up direction
    let rowUp = row - i;
    let rowDown = row + i;
    let colLeft = col - i;
    let colRight = col + i;

    // top left
    if (rowUp >= 0 && colLeft >= 0) {
      if (comparePieces(board, rowUp, colLeft, pieceToLookFor)) {
        isPieceFound = true;
        break;
      } else {
        break;
      }
    }

    // top right
    if (rowUp >= 0 && colRight < 8) {
      if (comparePieces(board, rowUp, colRight, pieceToLookFor)) {
        isPieceFound = true;
        break;
      } else {
        break;
      }
    }

    // bottom left
    if (rowDown < 8 && colLeft >= 0) {
      if (comparePieces(board, rowDown, colLeft, pieceToLookFor)) {
        isPieceFound = true;
        break;
      } else {
        break;
      }
    }

    // bottom right
    if (rowDown < 8 && colRight < 8) {
      if (comparePieces(board, rowDown, colRight, pieceToLookFor)) {
        isPieceFound = true;
        break;
      } else {
        break;
      }
    }
  }

  return isPieceFound;
};

const lookForKnight = (board, row, col, pieceColor) => {};

export const generateKingMoves = (board, selection) => {
  // cant go to a square that'll check the king
  const { row, col, color } = selection;

  const kingDirectionMoves = [
    [-1, -1], // top left
    [-1, 0], // top middle
    [-1, 1], // top right
    [0, -1], // middle left
    [1, -1], // bottom left
    [0, 1], // middle right
    [1, 0], // bottom middle
    [1, 1], // bottom right
  ];

  // if (lookForRook(board, 5, 4, color)) {
  //   console.log('not valid move');
  // } else {
  //   validMoves.push({ row: 5, col: 4, color });
  // }

  for (let i = 0; i < kingDirectionMoves.length; i++) {
    const targetRow = row + kingDirectionMoves[i][0];
    const targetCol = col + kingDirectionMoves[i][1];
    const inBoardBound =
      targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8;

    let isPossibleToMove = true;

    if (inBoardBound) {
      // console.log(lookForRook(board, targetRow, targetCol, color));
      if (lookForRook(board, targetRow, targetCol, color)) {
        isPossibleToMove = false;
        continue;
      }
      // if (lookForBishop(board, targetRow, targetCol, color)) {
      //   isPossibleToMove = false;
      //   continue;
      // }

      if (isPossibleToMove) {
        validMoves.push({ row: targetRow, col: targetCol, color: color });
      }
    }
  }

  // console.log(validMoves);

  return validMoves;
};
