import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://127.0.0.1:5500'],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let color = '';
let playerCount = 0;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join_game', (room) => {
    socket.join('1');
    playerCount++;
    let player = '';

    if (playerCount % 2 == 0) {
      player = 'player 2';
      color = 'black';
    } else {
      player = 'player 1';
      color = 'white';
    }

    socket.emit('your_name', player, color);
    if (playerCount == 2) {
      playerCount = 0;
    }
  });

  socket.on('move_piece', (room, row, col, tRow, tCol) => {
    socket.to(room).emit('move_piece', 7 - row, 7 - col, 7 - tRow, 7 - tCol);
  });
});

server.listen(5000, () => {
  console.log('listening on http://localhost:5000');
});
