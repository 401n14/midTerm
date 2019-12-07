'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * This is the mongoose schema for the chat log.
 * It represents the allowed data and it's type
 * @param {String} message - The actual message typed in chat
 * @param {ObjectId} userID - The ID of the user that wrote the message
 * @param {Date} timestamp - The timestamp for when the message was originally recorded
 * @type {Object} - Moongoose Schema constructor
 */
const chatSchema = new mongoose.Schema({
  message: {type: String, required: true},
  username: {type: String, required: true},
  userID : {type: Schema.Types.ObjectId},
  timestamp: {type: Date, default: new Date()},
});


//Needs a Pre hook that populates the userid that sent the message


module.exports = mongoose.model('chat', chatSchema);
