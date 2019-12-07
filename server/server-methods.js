'use strict';

/**
 * This is the apiKey variable that the server requires to translate messages with Google Translate
 * @constant apiKey
 * @type {string}
 */
const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyCNYLZpi8VQNnQ6EqR03itPSMW3fWIxH7g';

let options = {
    concurrentLimit: 20,
    requestOptions: {},
};

const googleTranslate = require('google-translate')(apiKey, options);
let socketPool = {};
let userGroup = {};

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

    googleTranslate.detectLanguage(data.language, function (err, detection) {
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
    if (socket.broadcast) {
        socket.broadcast.emit('new user', socket.username);
        // Anytime a new user signs in, console.log all users currently in chat
        socket.emit('list-chat-users', Object.values(userGroup));
    }
    return socket;
};

// This function handles messages going to and from each socket
const handleMessage = async (server, socket, data) => {
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
            googleTranslate.translate(data.message, socketPool[socket], function (err, translation) {
                /**
                 * sends the translated message consisting of '{user: user, color: data.color, message: translation.translatedText}'
                 * @event message
                 * @param {string} message message event
                 * @param {object} translationData {user: object, color: string, message, string}
                 * @param {object} user user object
                 * @param {string} data.color color from the data object
                 * @param {string} translation.translatedText translated version of the text
                 */
                server.to(`${socket}`).emit('message', {
                    user: user,
                    color: data.color,
                    message: translation.translatedText,
                    language,
                });
            });
        }
    }
};

// This function runs every time a user disconnects from the chat
const handleDisconnect = socket => {
    /**
     * event that occurs when a user leaves the chat. It will console log on the server '${socket.username} left the chat'
     * @param {string} exit exit event
     * @param {string} socket.username username of the socket that has left the chat
     * @event exit
     */
    delete userGroup[socket.id];
    socket.broadcast.emit('exit', socket.username);
    console.log(`${socket.username} left the chat`);
};

// Set exports object to include all server methods to enable testing
module.exports = {
    setUsername,
    setLanguage,
    handleMessage,
    handleDisconnect,
};