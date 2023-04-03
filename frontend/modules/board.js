export const ROW = 8;
export const COL = 8;

export const board = Array.from(Array(ROW), () =>
  new Array(COL).fill({
    letter: '',
    pathToIcon: '',
    color: '',
  })
);

const BLACK_VIEW = ['r', 'k', 'b', 'ki', 'q', 'b', 'k', 'r'];
const WHITE_VIEW = ['r', 'k', 'b', 'q', 'ki', 'b', 'k', 'r'];

export const createBoard = (playerColor) => {
  const enemyColor = playerColor === 'white' ? 'black' : 'white';
  let playerFirstLetter = playerColor[0];
  let enemyFirstLetter = enemyColor[0];
  let pieces = [];

  if (playerColor === 'white') {
    pieces = WHITE_VIEW;
  } else if (playerColor === 'black') {
    pieces = BLACK_VIEW;
  }

  for (let i = 0; i < ROW; i++) {
    board[0][i] = {
      letter: pieces[i],
      pathToIcon: `../icons/${enemyFirstLetter}${pieces[i]}.png`,
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
    board[7][i] = {
      letter: pieces[i],
      pathToIcon: `../icons/${playerFirstLetter}${pieces[i]}.png`,
      color: playerColor,
    };
  }
};

export const renderBoard = (boardElement) => {
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
