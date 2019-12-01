'use strict';

const io = require('socket.io')(process.env.PORT || 3000);

io.on('connection', (socket) => {
  socket.on('username', (data) => {
    socket.username = data.username;
    console.log(`${socket.username} joined the chat!`);
        
    socket.broadcast.emit('new user', socket.username);
  });

  socket.on('message', (data) => {
    socket.broadcast.emit('message', {user: socket.username, message: data});
  });

  socket.on('disconnect', () => {
    console.log(`User left the chat`);
  });
});