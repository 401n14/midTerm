'use strict';

const schema = require('./user-schema');
const Model = require('../model');

class User extends Model{
  constructor(){
    super(schema);
  }
}

module.exports = User;
