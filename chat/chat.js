'use strict';

const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');

const repl = require('repl');
let username;

socket.on('connect', () => {
    console.log(`Chat started`);
    username = process.argv[2];
    socket.emit('username', {username: username});
})

socket.on('message', (data) => {
    const { cmd, username } = data;

    console.log(username + ': ' + cmd.split('\n')[0]);
})

repl.start({
    eval: (cmd) => {
        socket.send({cmd, username})
    }
})