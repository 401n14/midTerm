'use strict';

const io = require('socket.io')(3000);

io.on('connection', (socket) => {
    socket.username = 'Anonymous';
    socket.on('username', (data) => {
        socket.username = data.username;
        console.log(`${socket.username} joined chat!`);
    })

    socket.on('message', (data) => {
        socket.broadcast.emit('message', data);
    });

    socket.on('disconnect', (socket) => {
        console.log('A user disconnected!');
    });
});

