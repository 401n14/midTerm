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
 * @requires NPM:googleTranslate
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

//Database instantiated and connected 
const dbServer = require('../model/db-server');
dbServer.connect();

//Instatiating the chat history mongoose model
const Chat = require('../model/chat/chat-model');
let chat = new Chat();

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
 * @name connection 
 * @param {string} connection 
 * @param {object} socket 
 */
io.on('connection', socket => {
  /**
   * event listener for 'username' event
   * This will set socket.username = data.username
   * Console logs to the server '${socket.username} joined the chat!'
   * @name username
   * @param {string} username
   * @param {object} data This is looking for data.username
   * 
   */
  socket.on('username', data => {
    socket.username = ` ${data.username}`;
    userGroup[socket.id] = ` ${socket.username}`;
  });

 
  /**
   * Listens for 'language' event
   * Calls detect language to determine language user typed in
   * Adds socket to socket pool with language preference 
   * @name language
   * @param {string} language 
   * @param {object} data 
   * @fires newuser
   */
  socket.on('language', async data => {
    let language;
    /**
     * GoogleTranslate will detect what language has been input or default to english
     * @method detectLanguage
     * @param {string} data.language This is the language preference the user inputs 
     * @param {error} err 
     * @param {object} detection looking for detection.language. 
     */

    await googleTranslate.detectLanguage(data.language, async function(err, detection) {
      // if unable to detect a language >> default to english
      if (!detection) {
        language = 'en';
      } else {
        language = detection.language;
      }
      socketPool[socket.id] = language;
      socket.language = socketPool[socket.id];

      // Display past chat history to users joining the chat
      socket.emit('chathistory', 'CHAT HISTORY');
      let chatHistory = await chat.find();
      console.log(chatHistory);
      
      const processChats = async () => {
        await asyncForEach(chatHistory, async (chat) => {
          await waitFor(85);
          googleTranslate.translate(chat.message, language, async function(err, translation) {
            await socket.emit('chats', {timestamp: chat.timestamp, user: chat.username, message: translation.translatedText});
          });
        });
      };

      processChats();
    });

    /**
     * 'new user' event that will broadcast socket.username to all connected sockets. 
     * @param {string} new_user 
     * @param {string} socket.username looks for the username in the socket object  
     * @event newuser
     */
    socket.broadcast.emit('new user', socket.username);

    // Anytime a new user signs in, console.log all users currently in chat
    io.emit('list-chat-users', Object.values(userGroup));
  });

  /**
   * Listens for 'message' event. This will loop through all connected sockets in the socket pool. This will translate the message according to the user's specified language preferences. 
   * @name message
   * @param {string} message message event
   * @param {object} data The user inputed data. Function will use data.message & data.color
   * @fires message
   */ 
  socket.on('message', async data => {
    // Send user and their spoken language with each message they send
    let user = socket.username.toUpperCase();
    let language = socket.language;

    // console.log(user.toUpperCase());
    // Add chate to database
    chat.create({ message: data.message, username: user.toUpperCase()});

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
        googleTranslate.translate(data.message, socketPool[socket], async function(err, translation) {
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
  });

  /**
   * Listens for a 'disconnect' event when a user leaves the chat
   * @name disconnect
   * @param {string} disconnect disconnect event
   * @param {object} socket function will use socket.username
   * @fires exit
   * @fires list-chat-users
   */
  socket.on('disconnect', () => {
    /**
     * event that occurs when a user leaves the chat. It will console log on the server '${socket.username} left the chat'
     * @param {string} exit exit event 
     * @param {string} socket.username username of the socket that has left the chat
     * @event exit
     * @event list-chat-users  
     */
    delete userGroup[socket.id];
    socket.broadcast.emit('exit', socket.username);
    socket.broadcast.emit('list-chat-users', Object.values(userGroup));
    console.log(`${socket.username} left the chat`);
  });
});

const asyncForEach = async (arr, callback) => {
  for (let index = 0; index < arr.length; index++){
    await callback(arr[index], index, arr);
  }
};
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));