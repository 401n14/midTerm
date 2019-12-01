'use strict';

const io = require('socket.io')(3000);
const translate = require('../translate');

let socketPool = {};

io.on('connection', socket => {
  // Listens for 'username' event 
  socket.on('username', data => {
    socket.username = data.username;
    console.log(`${socket.username} joined the chat!`);
  });

  // Listens for 'language' event
  // Calls detect language to determine language user typed in
  // Adds socket to socket pool with language preference 
  socket.on('language', async data => {
    let language = await translate.detectLanguage(data.language);
    console.log('LANGUAGA!: ', language);

    socketPool[socket.id] = language;

    // socket.language = data.language;
    // socket.emit('assign-language', data.language);

    socket.broadcast.emit('new user', socket.username);
  });

  // Listens for 'message' event
  // Loops through connected sockets in the socket pool 
  // Translates message according to their language preference and emits 'message' event to socket
  socket.on('message', async data => {
    let user = socket.username;

    for (let socket in socketPool) {
      if(socket !== data.user) {
        let translation = await translate.translateText(data.message, socketPool[socket]);
        console.log(`${socket}`, translation);
        io.to(`${socket}`).emit('message', {user: user, message: translation});
      }
    }
  });

  // Listens for a 'disconnect' event
  socket.on('disconnect', () => {
    console.log(`User left the chat`);
  });
});

