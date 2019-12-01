'use strict';

const io = require('socket.io')(3000);
const translate = require('../translate');

io.on('connection', socket => {
  socket.on('username', data => {
    socket.username = data.username;
    console.log(`${socket.username} joined the chat!`);

    // socket.broadcast.emit('new user', socket.username);
  });
  socket.on('language', data => {
    data.language = translate.detectLanguage(data.language);
    console.log('LANGUAGA!: ', data.language);

    socket.language = data.language;
    // socket.emit('assign-language', data.language);

    socket.broadcast.emit('new user', socket.username);
  });

  socket.on('message', async data => {
    let translation = await translate.translateText(data, socket.language);
    console.log('translation: ', translation);
    socket.broadcast.emit('message', {
      user: socket.username,
      message: translation,
    });
  });

  socket.on('disconnect', () => {
    console.log(`User left the chat`);
  });
});
