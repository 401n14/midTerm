'use strict';

const schema = require('./chat-schema');
const Model = require('../model');

class ChatHistory extends Model{
  constructor(){
    super(schema);
  }
}

module.exports = ChatHistory;