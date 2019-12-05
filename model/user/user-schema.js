'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  language: {type: String, required: true},
  displayName: {type: String, required: true},
});

userSchema.pre('save', function () {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
    }).catch(error =>  console.error(error) );
});

// This function compares the password with what's in the schema
// uses bcrypt to compare the this.password with what's in the Schema

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};


module.exports = mongoose.model('user', userSchema);