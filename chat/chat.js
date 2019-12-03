'use strict';

// Import socket.io client
const io = require('socket.io-client');
const socket = io.connect('https://n14-transcribe.herokuapp.com');

// Import chalk for terminal styling
const chalk = require('chalk');

// Import readline for input/output through terminal
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create username for each socket connection
let username;

// Listens for a 'connect' event
// Prompt for name and language
socket.on('connect', () => {
  console.log(chalk.hex('#2EC4B6')(`>>>> Welcome to Transcribe <<<<\n`));

  // Use readline to prompt for name
  rl.question(chalk.hex('#FF9F1C')('What is your name? '), answer => {
    username = answer;
    // Emits a 'username' event with user input
    socket.emit('username', { username });

    // Use readline to prompt for language
    rl.question(chalk.hex('#FF9F1C')('What language do you speak? '), language => {
      // Emits a 'language' event with user input
      socket.emit('language', { language });
    });
  });
});

// When a user sends a message
// A 'message' event is emitted containing the socket id along with the message entered
rl.on('line', message => {
  socket.emit('message', {user: socket.id, message});
});

// Listens for a 'message' event and console logs data
socket.on('message', data => {
  console.log(chalk.hex('#FF9F1C').bold(`${data.user}: `) + `${data.message}`);
});

// Listens for a 'new user' event and console logs data
socket.on('new user', data => {
  console.log(chalk.hex('#011627').bold(`\n>>>> ${data} joined the chat <<<<\n`));
});
