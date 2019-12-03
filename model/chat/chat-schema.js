'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema({
  message: {type: String, required: true},
  userID : {type: Schema.Types.ObjectId},
  timestamp: {type: Date, default: new Date()},
});


//Needs a Pre hook that populates the userid that sent the message


module.exports = mongoose.model('chat', chatSchema);