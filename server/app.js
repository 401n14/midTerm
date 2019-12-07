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
const serverMethods = require('./server-methods');

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

app.use('/docs', express.static('./docs'));

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

//Database instantiated and connected 
const dbServer = require('../model/db-server');
dbServer.connect();

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
  socket.on('username', data => {
    serverMethods.setUsername(socket, data);
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
    serverMethods.setLanguage(io, socket, data);
  });

  // Listens for 'message' event
  // Loops through connected sockets in the socket pool
  // Translates message according to their language preference and emits 'message' event to socket
  /**
   * Listens for 'message' event. This will loop through all connected sockets in the socket pool. This will translate the message according to the user's specified language preferences.
   * @param {string} message message event
   * @param {object} data The user inputed data. Function will use data.message & data.color
   * @fires message
   */

  socket.on('message', data => {
    serverMethods.handleMessage(io, socket, data);
  });

  // Listens for a 'disconnect' event
  /**
   * Listens for a 'disconnect' event when a user leaves the chat
   * @param {string} disconnect disconnect event
   * @fires exit
   */
  socket.on('disconnect', () => {
    serverMethods.handleDisconnect(socket);
  });
});
