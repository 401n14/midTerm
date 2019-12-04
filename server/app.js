'use strict';
/**
 * @fileoverview This is the app.js file and it starts the server and begins listening for the connection of sockets
 * @author Anna Li
 * @author Nadya Ilinskaya
 * @author James Dunn
 * 
 * @requires NPM:express
 * @requires NPM:socket.io
 * 
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
   * @param {string} username
   * @param {object} data This is looking for data.username
   * 
   */
  socket.on('username', data => {
    socket.username = data.username;
    console.log(`${socket.username} joined the chat!`);
  });

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
  socket.on('language', data => {
    let language;
    /**
     * GoogleTranslate will detect what language has been input or default to english
     * @method detectLanguage
     * @param {string} data.language This is the language preference the user inputs 
     * @param {error} err 
     * @param {object} detection looking for detection.language. 
     */

    googleTranslate.detectLanguage(data.language, function(err, detection){
      // if unable to detect a language >> default to english
      if(!detection) {
        language = 'en';
      } else {
        language = detection.language;
      }
      socketPool[socket.id] = language;
    });
    /**
     * emits a 'new user' event 
     * @param {string} new_user 
     * @param {string} socket.username looks for the username in the socket object  
     * @event newuser
     */

    socket.broadcast.emit('new user', socket.username);
  });

  // Listens for 'message' event
  // Loops through connected sockets in the socket pool 
  // Translates message according to their language preference and emits 'message' event to socket
  socket.on('message', async data => {
    let user = socket.username;

    for (let socket in socketPool) {
      if(socket !== data.user) {
        googleTranslate.translate(data.message, socketPool[socket], function (err, translation) {
          io.to(`${socket}`).emit('message', {user: user, color: data.color, message: translation.translatedText});
        });
      }
    }
  });

  // Listens for a 'disconnect' event
  socket.on('disconnect', () => {
    socket.broadcast.emit('exit', socket.username);
    console.log(`${socket.username} left the chat`);
  });
});
