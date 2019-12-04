'use strict';

const schema = require('./chat-schema');
const Model = require('../model');


class ChatHistory extends Model{
  constructor(){
    super(schema);
  }
  /**
   * Find allows us to read the chat collection and find the last five chats that were saved
   * @method
   * @returns {Object} - The last 5 records of the chat log
   */
  find() {
    //Finds the last five records in the chat history and orders them by their timestamp with the newest message being first;
    return this.schema.find().sort({ timestamp: 'ascending' }).limit(5);
  }
}

module.exports = ChatHistory;