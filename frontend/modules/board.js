const BLACK_VIEW = ['R', 'K', 'B', 'KI', 'Q', 'B', 'K', 'R'];
const WHITE_VIEW = ['r', 'k', 'b', 'q', 'ki', 'b', 'k', 'r'];
import { ROW, COL } from '../constant.js';

export const createBoard = (board, playerColor) => {
  const enemyColor = playerColor === 'white' ? 'black' : 'white';

  let playerFirstLetter = playerColor[0];
  let enemyFirstLetter = enemyColor[0];
  let playerPieces = [];
  let enemyPieces = [];

  let playerPawn = '';
  let enemyPawn = '';

  if (playerColor === 'white') {
    playerPawn = 'p';
    enemyPawn = 'P';
  } else {
    playerPawn = 'P';
    enemyPawn = 'p';
  }

  if (playerColor === 'white') {
    playerPieces = WHITE_VIEW;
    enemyPieces = BLACK_VIEW;
  } else if (playerColor === 'black') {
    playerPieces = BLACK_VIEW;
    enemyPieces = WHITE_VIEW;
  }

  for (let i = 0; i < ROW; i++) {
    board[0][i] = {
      letter: enemyPieces[i],
      pathToIcon: `../icons/${enemyFirstLetter}${enemyPieces[
        i
      ].toLowerCase()}.png`,
      color: enemyColor,
    };
    board[1][i] = {
      letter: enemyPawn,
      pathToIcon: `./icons/${enemyFirstLetter}p.png`,
      color: enemyColor,
      direction: 'down',
    };
    board[6][i] = {
      letter: playerPawn,
      pathToIcon: `./icons/${playerFirstLetter}p.png`,
      color: playerColor,
      direction: 'up',
    };
    board[7][i] = {
      letter: playerPieces[i],
      pathToIcon: `../icons/${playerFirstLetter}${playerPieces[
        i
      ].toLowerCase()}.png`,
      color: playerColor,
    };
  }
  // board[2][3] = {
  //   letter: 'P',
  //   pathToIcon: `../icons/bp.png`,
  //   color: 'black',
  // };
  // board[2][4] = {
  //   letter: 'R',
  //   pathToIcon: `../icons/bp.png`,
  //   color: 'black',
  // };
  //  board[2][5] = {
  //   letter: 'P',
  //   pathToIcon: `../icons/bp.png`,
  //   color: 'black',
  // };
  // board[4][5] = {
  //   letter: 'ki',
  //   pathToIcon: `../icons/${playerFirstLetter}ki.png`,
  //   color: 'white',
  // };
  // board[5][4] = {
  //   letter: 'P',
  //   pathToIcon: `../icons/bp.png`,
  //   color: 'black',
  // };
};

export const renderBoard = (board, boardElement) => {
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
        img.style.height = '60px';
        img.style.width = '60px';
        img.style.pointerEvents = 'none';
      }

      // colDiv.innerHTML = letter;

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
