'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
});

//Needs password authentication

module.exports = mongoose.model('user', userSchema);