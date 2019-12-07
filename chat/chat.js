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

// const socket = io.connect('https://n14-transcribe.herokuapp.com/');
const socket = io.connect('http://localhost:3000');


const chatMethods = require('./chat-methods.js');

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
  output: process.stdout
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
   */
  rl.question(chalk.hex('#FF9F1C')('Please enter a username: '), username => {
    // if user does not input a username >> default to anonymous
    if(!username) {
      username = 'Anonymous';
    }
    socket.username = username;
    users[socket.username] = chatMethods.getRandomColor();
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
    rl.question(chalk.hex('#FF9F1C')('Please type hello in your preferred language: '), language => {
      /**
       * @event language
       * @param {string} 'language'
       * @param {object} language {language: string}
       * This will console log '==== START CHATTING ===='
       */

      if(!language){
        language = 'hello';
      }
      socket.emit('language', { language });
      console.log(chalk.hex('#2EC4B6')(`\n==== CHAT STARTED ====\n`));
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
  if (!message) {
    message = '[empty message]';
  }
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

/**
 * listens for a 'message' event and it will console log the message 
 * @name message
 * @param {string} message 'message' event
 * @param {object} data will need data.color, data.user, data.language, and data.message
 * 
 */
socket.on('message', data => {
  chatMethods.printMessage(data);
});

/**
 * Listens for a 'new user' event and console logs data
 * @name newuser
 * @param {string} 'new user'
 * @param {object} data 
 * 
 */
socket.on('new user', data => {
  chatMethods.printNewUser(data);
});
/**
 * event listener for the chathistory event
 * @name chathistory
 * @param chathistory event
 * @param
 */
socket.on('chathistory', data => {
  chatMethods.printChatHistory(data);

  socket.on('chats', message =>{
    chatMethods.printChats(message);
  });
});

/**
 * This will listen for 'list-chat-users'
 * @name list-chat-users
 * @param {string} 'list-chat-users'
 * @param {object} users 
 */
socket.on('list-chat-users', users => {
  chatMethods.printUsers(users);
});

/**
 * This will listen for the 'exit' event
 * @name exit
 * @param {string} exit
 * @param {string} data username of the person leaving the chat
 * 
 */
socket.on('exit', data =>{
  chatMethods.printExit(data);
});
