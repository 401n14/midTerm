'use strict';

// Import socket.io client
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000/');

//Database
const Chat = require('../model/chat/chat-model');
let chat = new Chat();

// Import chalk for terminal styling
const chalk = require('chalk');

// Import readline for input/output through terminal
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// To store users with their generated color
let users = {};

// Listens for a 'connect' event
// Prompt for name and language
socket.on('connect', () => {
  console.log(chalk.hex('#2EC4B6')(`>>>> Welcome to Transcribe <<<<\n`));

  // Use readline to prompt for name
  rl.question(chalk.hex('#FF9F1C')('What is your name? '), username => {
    socket.username = username;
    users[socket.username] = getRandomColor();
    // Emits a 'username' event with user input
    socket.emit('username', { username });

    // Use readline to prompt for language

    rl.question(chalk.hex('#FF9F1C')('Please input your preferred language in your preferred language: '), language => {
      // Emits a 'language' event with user input
      socket.emit('language', { language });
      console.log(chalk.hex('#2EC4B6')(`\n==== CHAT STARTED ====\n`));
    });
  });
});

// When a user sends a message
// A 'message' event is emitted containing the socket id along with the message entered
rl.on('line', message => {
  let color = users[socket.username];
  socket.emit('message', {user: socket.id, color: color, message});
});

// Listens for a 'message' event and console logs data
socket.on('message', data => {
  console.log(chalk.hex(`${data.color}`).bold(`${data.user} (${data.language}): `) + `${data.message}`);
});

// Listens for a 'new user' event and console logs data
socket.on('new user', data => {
  console.log(chalk.hex('#32E875').bold(`\n>>>> ${data} joined the chat <<<<\n`));
});

socket.on('chathistory', data => {
  console.log(chalk.hex('#2EC4B6')(`==== ${data} ====`));

  socket.on('chats', message =>{
    console.log(chalk.hex('#32E875')(`${message.timestamp} ${message.message}`));
  });
});

socket.on('list-chat-users', users => {
  console.log(chalk.hex('#FF9F1C')(`Current Users: ${users}\n`));
});

function getRandomColor() {
  return '#' + parseInt(Math.random() * 0xffffff).toString(16);
}

socket.on('exit', data => {
  console.log(chalk.hex('#32E875').bold(`\n>>>> ${data} left the chat <<<<\n`));
});
