'use strict';
/**
 * @fileoverview chat.js
 * 
 * @author Anna Li
 * @author Nadya Ilinskaya
 * @author James Dunn
 * 
 * @requires NPM:socket.io
 * @requires NPM:chalk
 * @requires NPM:readline
 * 
 */

// Import socket.io client
const io = require('socket.io-client');
const socket = io.connect('https://transcribe-jamm.herokuapp.com');

// Import chalk for terminal styling
const chalk = require('chalk');

// Import readline for input/output through terminal
const readline = require('readline');
/**
 * readline
 * @constructor readline
 * @method createInterface
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// To store users with their generated color
let users = {};


/**
 *  Listens for a connect event and then will prompt the user for their name and language
 * @name connect
 * @param {string} connect event listener for when a socket successfully connects to the server
 * @param {object}
 * Will console log: '>>>> Welcome to Transcribe <<<<'
 * @fires username
 * @fires language
 */
socket.on('connect', () => {
  console.log(chalk.hex('#2EC4B6')(`>>>> Welcome to Transcribe <<<<\n`));

  /**
   * Use readline to prompt for name
   * @method question
   * @param {method} chalk.hex method that requires two params (color: string)
   * @param {string} #FF9F1C color of the string
   * @param {string} 'What is your name?'
   * @param {object} username 
   * will assign a random color to the user
   * 
   */
  rl.question(chalk.hex('#FF9F1C')('What is your name? '), username => {
    socket.username = username;
    users[socket.username] = getRandomColor();
    /**
     * @event username
     * @param {string} 'username'
     * @param {object} username {username: string}
     */
    socket.emit('username', { username });

    /**
     * Use readline to prompt for language
     * @method question (query: string, callback)
     * @param {method} chalk.hex method that requires two params (color: string)
     * @param {string} '#FF9F1C' color of the string
     * @param {string} 'Please input your preferred language in your preferred language: '
     * @param {object} language 
     * 
     */
    rl.question(chalk.hex('#FF9F1C')('Please input your preferred language in your preferred language: '), language => {

      /**
       * @event language
       * @param {string} 'language'
       * @param {object} language {language: string}
       * This will console log '==== START CHATTING ===='
       */

      socket.emit('language', { language });
      console.log(chalk.hex('#2EC4B6')(`\n==== START CHATTING ====\n`));
    });
  });
});


/**
 * listens for the 'line' event when a user inputs a message
 * @name line
 * @param {string} line 'line' event
 * @param {object} message {message: string}
 * @fires message
 */
rl.on('line', message => {
  let color = users[socket.username];
  /**
   * event containing the socket id along with the message entered
   * @event message
   * @param {object} {} {user: socket.id, color: color, message}
   * @param {string} socket.id
   * @param {string} color
   * @param {string} message
   */
  socket.emit('message', {user: socket.id, color: color, message});
});

// Listens for a 'message' event and console logs data
/**
 * listens for a 'message' event and it will console log the message 
 * @name message
 * @param {string} message 'message' event
 * @param {object} data will need data.color, data.user, data.language, and data.message
 * will console log '${data.color} ).bold( ${data.user} (${data.language}): ) + ${data.message} '
 */
socket.on('message', data => {
  console.log(chalk.hex(`${data.color}`).bold(`${data.user} (${data.language}): `) + `${data.message}`);
});

/**
 * Listens for a 'new user' event and console logs data
 * @name newuser
 * @param {string} 'new user'
 * @param {object} data 
 * This will console log '>>>> ${data} joined the chat <<<<'
 * 
 */
socket.on('new user', data => {
  console.log(
    chalk.hex('#32E875').bold(`\n>>>> ${data} joined the chat <<<<\n`),
  );
});

/**
 * This will listen for 'list-chat-users'
 * @name list-chat-users
 * @param {string} 'list-chat-users'
 * @param {object} users 
 * This will console log 'Current Users: ' + users'
 */
socket.on('list-chat-users', users => {
  console.log(chalk.hex('#FF9F1C')('Current Users: ' + users));
});

/**
 * This function will use built in JS methods to create a random hex color
 * @function getRandomColor
 * @returns {string} random color string
 */
function getRandomColor() {
  return '#' + parseInt(Math.random() * 0xffffff).toString(16);
}
/**
 * This will listen for the 'exit' event
 * @name exit
 * @param {string} exit
 * @param {object} data 
 * This will console log \n>>>> ${data} left the chat <<<<\n
 */
socket.on('exit', data => {
  console.log(chalk.hex('#32E875').bold(`\n>>>> ${data} left the chat <<<<\n`));
});
