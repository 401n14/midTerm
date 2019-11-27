'use strict';

const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

let username;

socket.on('connect', () => {
    console.log(`Chat started\n`);

    rl.question('What is your name? ', (answer) => {
        username = answer;
        socket.emit('username', {username: username});
    });
});

rl.on('line', (message) => {
    socket.emit('message', message);
});

socket.on('message', (data) => {
    console.log(`${data.user}: ${data.message}`)
});

socket.on('new user', (data) => {
    console.log(`${data} joined the chat\n`)
});
