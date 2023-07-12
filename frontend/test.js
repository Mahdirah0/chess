socket.on('start_game', ({ color, opponent }) => {
  playerColor = color;
  createBoard(color);
  renderBoard(boardElement);
  addColListener();
});
