'use strict';

const schema = require('./user-schema');
const Model = require('../model');

/**
 * A class representing the Users collection in our database
 */
class User extends Model{
  /**
   * The constructor for a User model
   * @param {Object} schema - A mongoose model that defines the schema for our data
   */
  constructor(){
    super(schema);
  }
}

module.exports = User;
