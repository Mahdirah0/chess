import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

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

const gameBoard = [];

const checkRoomSize = async (room: string) => {
  const sockets = await io.in(room).fetchSockets();
  return sockets.length;
};

const gameRoom = [
  {
    room_example: {
      player1: 'mahdi',
      player2: 'john',
    },
  },
];

// following this stricture
// after the user joined the room we can privately message them
// the colour (white or black) and the opponents name

io.on('connection', async (socket) => {
  socket.on('join', async ({ room, name }) => {
    socket.join([room, name]);
    const numberOfPeople: number = await checkRoomSize(room);

    if (numberOfPeople === 2) {
      let player1 = gameRoom[0].room_example.player1;
      let player2 = gameRoom[0].room_example.player2;
      io.to(player1).emit('start_game', { color: 'white', opponent: player2 });
      io.to(player2).emit('start_game', { color: 'black', opponent: player1 });
    }

    // if (numberOfPeople === 1) {
    //   console.log(room);
    //   socket.emit('start_game', { color: 'white' });
    // } else if (numberOfPeople === 2) {
    //   socket.emit('start_game', { color: 'black' });
    // }
  });

  socket.on('move_piece', (room, row, col, tRow, tCol) => {
    socket.to('room').emit('move_piece', 7 - row, 7 - col, 7 - tRow, 7 - tCol);
  });
});

server.listen(5000, () => {
  console.log('listening on http://localhost:5000');
});
