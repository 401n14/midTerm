'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new mongoose.Schema({
  //This will be the socket.ID
  connection: {type: String, required: true},
  //The user who is associated with this connection
  user: { type: Schema.Types.ObjectId},
});

module.exports = mongoose.model('connection', connectionSchema);