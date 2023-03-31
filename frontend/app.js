const boardElement = document.querySelector('.board');
const button = document.querySelector('.roomButton');
const input = document.querySelector('.roomInput');
let board = [];

const ROW = 8;
const COL = 8;

const WHITE_PIECES = ['r', 'k', 'b', 'q', 'ki', 'b', 'k', 'r'];
const BLACK_PIECES = ['r', 'k', 'b', 'ki', 'q', 'b', 'k', 'r'];

let turn = 'white';
let playerColor = '';

const ENEMY_PIECE_COL = 'red';
const NEUTRAL_PIECE_COL = '#012300';

let startSelection = {
  row: -1,
  col: -1,
  letter: '',
  selected: false,
  color: '',
};

const validMove = [];

const socket = io('http://localhost:5000/');

const createBoard = () => {
  const initBoard = Array.from(Array(ROW), () =>
    new Array(COL).fill({
      letter: '',
      pathToIcon: '',
      color: '',
      inCheck: false,
    })
  );

  let enemyColor = playerColor === 'white' ? 'black' : 'white';

  let playerFirstLetter = playerColor[0];
  let enemyFirstLetter = enemyColor[0];
  let pieces = [];

  if (playerColor === 'white') {
    pieces = WHITE_PIECES;
  } else if (playerColor === 'black') {
    pieces = BLACK_PIECES;
  }

  for (let i = 0; i < ROW; i++) {
    initBoard[0][i] = {
      letter: pieces[i],
      pathToIcon: `./icons/${enemyFirstLetter}${pieces[i]}.png`,
      color: enemyColor,
    };
    // initBoard[1][i] = {
    //   letter: 'p',
    //   pathToIcon: `./icons/${enemyFirstLetter}p.png`,
    //   color: enemyColor,
    // };
    // initBoard[6][i] = {
    //   letter: 'p',
    //   pathToIcon: `./icons/${playerFirstLetter}p.png`,
    //   color: playerColor,
    // };
    initBoard[7][i] = {
      letter: pieces[i],
      pathToIcon: `./icons/${playerFirstLetter}${pieces[i]}.png`,
      color: playerColor,
    };
  }

  return initBoard;
};

const renderBoard = () => {
  for (let i = 0; i < ROW; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    rowDiv.setAttribute('row', i);
    for (let j = 0; j < COL; j++) {
      const colDiv = document.createElement('div');
      const { letter, color, pathToIcon } = board[i][j];

      const img = document.createElement('img');
      if (letter !== '') {
        img.src = pathToIcon;
        img.style.height = '30px';
        img.style.width = '30px';
        img.style.pointerEvents = 'none';
      }

      colDiv.innerHTML = letter;

      const backgroundColor = j % 2 == i % 2 ? 'white' : 'burlywood';

      colDiv.style.backgroundColor = backgroundColor;

      colDiv.classList.add('col');
      colDiv.setAttribute('pos', `${i}-${j}`);
      colDiv.setAttribute('color', color);
      colDiv.appendChild(img);
      rowDiv.append(colDiv);
    }
    boardElement.append(rowDiv);
  }
};

socket.on('move_piece', (row, col, tRow, tCol) => {
  const currentPiece = board[row][col];
  console.log(currentPiece);

  console.log(row, col);
  console.log(tRow, tCol);

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

  renderBoard();
  addColListener();

  startSelection = {
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
  const { row, col } = startSelection;

  socket.emit('move_piece', '1', row, col, tRow, tCol);

  const currentPiece = board[row][col];
  console.log(currentPiece);

  console.log(row, col);
  console.log(tRow, tCol);

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

  renderBoard();
  addColListener();

  startSelection = {
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
    return;
  }

  const legalMovesDiv = document.querySelectorAll(`div[pos="${pos}"]`);
  legalMovesDiv.forEach((item) => {
    const circle = document.createElement('div');
    circle.style.height = '25px';
    circle.style.width = '25px';
    circle.style.backgroundColor = bgColor;
    circle.style.borderRadius = '50%';
    circle.style.pointerEvents = 'none';
    item.append(circle);
  });
};

const isPieceWhite = (color) => {
  return color === 'white';
};

const addSquareToValidMove = (row, col, isCurrentPieceWhite) => {
  const { letter, color } = board[row][col];
  const isEnemyPieceWhite = isPieceWhite(color);

  if (letter === '') {
    validMove.push({ row, col, enemy: false });
    return;
  }

  if (isCurrentPieceWhite !== isEnemyPieceWhite) {
    validMove.push({ row, col, enemy: true });
    return true;
  }

  return true;
};

const generateRookMoves = () => {
  const { row, col, color } = startSelection;
  const isWhite = isPieceWhite(color);

  for (let i = col + 1; i < COL; i++) {
    if (addSquareToValidMove(row, i, isWhite)) {
      break;
    }
  }

  // left col
  for (let i = col - 1; i >= 0; i--) {
    if (addSquareToValidMove(row, i, isWhite)) {
      break;
    }
  }

  // row down
  for (let i = row + 1; i < ROW; i++) {
    if (addSquareToValidMove(i, col, isWhite)) {
      break;
    }
  }

  // row up
  for (let i = row - 1; i >= 0; i--) {
    if (addSquareToValidMove(i, col, isWhite)) {
      break;
    }
  }
};

const generateKnightMoves = () => {
  const { row, col, color } = startSelection;
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
      addSquareToValidMove(targetRow, targetCol, isWhite);
    }
  });
};

const generateBishopMoves = () => {
  const { row, col, color } = startSelection;
  const isWhite = isPieceWhite(color);

  for (let i = 1; i < ROW; i++) {
    let tempRow = row - i;
    let tempCol = col + i;

    if (tempRow < 0 || tempCol >= COL) {
      break;
    }

    if (addSquareToValidMove(tempRow, tempCol, isWhite)) {
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

    if (addSquareToValidMove(tempRow, tempCol, isWhite)) {
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

    if (addSquareToValidMove(tempRow, tempCol, isWhite)) {
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

    if (addSquareToValidMove(tempRow, tempCol, isWhite)) {
      break;
    }
  }
};

const generatePawnMoves = () => {
  const { row, col, color } = startSelection;

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

const generateMove = () => {
  const { letter } = startSelection;

  if (letter.toLowerCase() === 'r') {
    generateRookMoves();
  } else if (letter.toLowerCase() === 'k') {
    generateKnightMoves();
  } else if (letter.toLowerCase() === 'b') {
    generateBishopMoves();
  } else if (letter.toLowerCase() === 'q') {
    generateRookMoves();
    generateBishopMoves();
  } else if (letter.toLowerCase() === 'p') {
    generatePawnMoves();
  }
};

const showMove = () => {
  const { row, col } = startSelection;

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

const isValid = (row, col) => {
  for (let i = 0; i < validMove.length; i++) {
    if (row === validMove[i].row && col === validMove[i].col) {
      return true;
    }
  }

  return false;
};

const isMoveLegal = (row, col) => {
  if (isValid(row, col)) {
    move(row, col);
  }
};

const handleClick = (e) => {
  const pos = e.target.attributes.pos.value;
  const row = parseInt(pos[0]);
  const col = parseInt(pos[2]);
  const letter = board[row][col].letter;
  const color = e.target.getAttribute('color');

  let samePiece = startSelection.row === row && startSelection.col === col;
  let sameTeam = startSelection.color === color;

  if (sameTeam) {
    while (boardElement.firstChild) {
      boardElement.removeChild(boardElement.firstChild);
    }

    validMove.splice(0, validMove.length);
    renderBoard();
    addColListener();
  }

  if (samePiece && startSelection.selected) {
    while (boardElement.firstChild) {
      boardElement.removeChild(boardElement.firstChild);
    }

    renderBoard();
    addColListener();
    startSelection.selected = false;
    validMove.splice(0, validMove.length);
  } else if (turn === color && playerColor === color) {
    startSelection = { row, col, letter, color, selected: true };
    generateMove();
    showMove();
  } else if (startSelection.selected) {
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
  const { value } = input;

  socket.emit('join_game', value);
});

const startGame = () => {
  renderBoard();
  addColListener();
};

socket.on('your_name', (name, color) => {
  playerColor = color;
  board = createBoard();
  startGame();
});
