'use strict';
/**
 * @fileoverview This is the app.js file and it starts the server and begins listening for the connection of sockets
 * @author Anna Li
 * @author Nadya Ilinskaya
 * @author James Dunn
 *
 * @requires NPM:express
 * @requires NPM:socket.io
 * @requires NPM:dotenv
 *
 */
const express = require('express');
const socketIO = require('socket.io');

const dotenv = require('dotenv');
dotenv.config();
/**
 * This is the PORT variable that the server will use. It is declared in the .env file or defaults to 3000
 * @constant PORT
 * @type {number}
 * port number
 */
const PORT = process.env.PORT || 3000;
const app = express();

/**
 * This is the apiKey variable that the server requires to translate messages with Google Translate
 * @constant apiKey
 * @type {string}
 */
const apiKey = process.env.GOOGLE_API_KEY;

let options = {
  concurrentLimit: 20,
  requestOptions: {},
};

const googleTranslate = require('google-translate')(apiKey, options);

app.use('/docs', express.static('./docs'));

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
let socketPool = {};
let userGroup = {};

/**
 * this is an event listener for 'connection' event. This is emitted when a new socket connects to the chat server
 * @param {string} connection
 * @param {object} socket
 */
io.on('connection', socket => {
  // Listens for 'username' event
  /**
   * event listener for 'username' event
   * This will set socket.username data.username
   * Console logs to the server '${socket.username} joined the chat!'
   * @param {string} username
   * @param {object} data This is looking for data.username
   *
   */
  socket.on('username', setUsername(socket));

  // Listens for 'language' event
  // Calls detect language to determine language user typed in
  // Adds socket to socket pool with language preference
  /**
   * Listens for 'language' event
   * Calls detect language to determine language user typed in
   * Adds socket to socket pool with language preference
   * @param {string} language
   * @param {object} data
   * @fires newuser
   */
  socket.on('language', setLanguage(socket));

  // Listens for 'message' event
  // Loops through connected sockets in the socket pool
  // Translates message according to their language preference and emits 'message' event to socket
  /**
   * Listens for 'message' event. This will loop through all connected sockets in the socket pool. This will translate the message according to the user's specified language preferences.
   * @param {string} message message event
   * @param {object} data The user inputed data. Function will use data.message & data.color
   * @fires message
   */

  socket.on('message', handleMessage(socket));

  // Listens for a 'disconnect' event
  /**
   * Listens for a 'disconnect' event when a user leaves the chat
   * @param {string} disconnect disconnect event
   * @param {object} socket function will use socket.username
   * @fires exit
   */
  socket.on('disconnect', () => {
    /**
     * event that occurs when a user leaves the chat. It will console log on the server '${socket.username} left the chat'
     * @param {string} exit exit event
     * @param {string} socket.username username of the socket that has left the chat
     * @event exit
     */
    delete userGroup[socket.id];
    socket.broadcast.emit('exit', socket.username);
    console.log(`${socket.username} left the chat`);
  });
});

// Declare function to set socket username
const setUsername = (socket, data) => {
  socket.username = ` ${data.username}`;
  userGroup[socket.id] = ` ${socket.username}`;
};

// Declare function that sets the individual socket's language preference based on their input
const setLanguage = (socket, data) => {
  let language;
  /**
   * GoogleTranslate will detect what language has been input or default to english
   * @method detectLanguage
   * @param {string} data.language This is the language preference the user inputs
   * @param {error} err
   * @param {object} detection looking for detection.language.
   */

  googleTranslate.detectLanguage(data.language, function(err, detection) {
    // if unable to detect a language >> default to english
    if (!detection) {
      language = 'en';
    } else {
      language = detection.language;
    }
    socketPool[socket.id] = language;
    socket.language = socketPool[socket.id];
  });
  /**
   * 'new user' event that will broadcast socket.username to all connected sockets.
   * @param {string} new_user
   * @param {string} socket.username looks for the username in the socket object
   * @event newuser
   */

  socket.broadcast.emit('new user', socket.username);
  // Anytime a new user signs in, console.log all users currently in chat
  socket.emit('list-chat-users', Object.values(userGroup));
};

// This function handles messages going to and from each socket
const handleMessage = async (socket, data) => {
  // Send user and their spoken language with each message they send
  let user = socket.username;
  let language = socket.language;

  for (let socket in socketPool) {
    if (socket !== data.user) {
      /**
       * GoogleTranslate will translate the user input message
       * @method translate
       * @param {string} data.message the user inputted message
       * @param {string} socketPool[socket]
       * @param {error} err
       * @param {object} translation will use translation.translatedText
       *
       */
      googleTranslate.translate(data.message, socketPool[socket], function(
        err,
        translation,
      ) {
        /**
         * sends the translated message consisting of '{user: user, color: data.color, message: translation.translatedText}'
         * @event message
         * @param {string} message message event
         * @param {object} translationData {user: object, color: string, message, string}
         * @param {object} user user object
         * @param {string} data.color color from the data object
         * @param {string} translation.translatedText translated version of the text
         */
        io.to(`${socket}`).emit('message', {
          user: user,
          color: data.color,
          message: translation.translatedText,
          language,
        });
      });
    }
  }
};