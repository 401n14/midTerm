'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
 * This is the mongoose schema for connections.
 * It represents the allowed data and it's type
 * @param {String} connection - This is the ID of the socket that has connected to our server
 * @param {ObjectId} user - The ID of the user associated with the connection
 * @type {Object} - Moongoose Schema constructor
 */
const connectionSchema = new mongoose.Schema({
  //This will be the socket.ID
  connection: {type: String, required: true},
  //The user who is associated with this connection
  user: { type: Schema.Types.ObjectId},
});

module.exports = mongoose.model('connection', connectionSchema);
