'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});



// Hashes given password
userSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    }).catch(error => { throw error; });
});

// This function compares the password with what's in the schema
// uses bcrypt to compare the this.password with what's in the Schema

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

// function that generates a token and assigns it to an _id in the schema
// uses jsonwebtoken to sign the tokenData and salts it with our .env file's secret

userSchema.methods.generateToken = function () {
  let tokenData = {
    id: this._id,
  };
  return jwt.sign(tokenData, process.env.SECRET);
};

//exports user-schema use outside of this file

module.exports = mongoose.model('user', userSchema);