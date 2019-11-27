'use strict';

const io = require('socket.io')(3000);

io.on('connection', (socket) => {

    socket.on('username', (data) => {
        socket.username = data.username;
        console.log(`${socket.username} joined the chat!`);
        socket.broadcast.emit('username', socket.username);
    });

    socket.on('message', (data) => {
        socket.broadcast.emit('message', data);
    });

    socket.on('disconnect', (socket) => {
        console.log(`User left the chat`);
    });
});