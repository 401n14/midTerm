'use strict';

const schema = require('./connection-schema');
const Model = require('../model');

class Connection extends Model{
  constructor(){
    super(schema);
  }
}

module.exports = Connection;