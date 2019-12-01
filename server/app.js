'use strict';
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const server = express()
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

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