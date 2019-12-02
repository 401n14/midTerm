'use strict';

const schema = require('./chat-schema');
const Model = require('../model');


class ChatHistory extends Model{
  constructor(){
    super(schema);
  }
  //find() which finds the last 5-10 entries for chat so that we can populate a chat history
  find() {
    //Finds the last five records in the chat history and orders them by their timestamp with the newest message being first;
    return this.schema.find().sort({ timestamp: 'ascending' }).limit(5);
  }
}

module.exports = ChatHistory;