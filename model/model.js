'use strict';

const mongoose = require('mongoose');

class Model {
  constructor(schema){
    this.schema = schema;
  }

  //method for creating a user
  //also needs to create connections and chats

  //method for reading users from username

  //method for updating users 
  //(Do users need to be updated? Change password maybe?)

  //method for deleting users
  //(Does that delete all the chats associated with them?) <-- Stretch Goal probably
  //delete functionality once a connection is closed

  //find() which finds the last 5-10 entries for chat so that we can populate a chat history
}





module.exports = Model;