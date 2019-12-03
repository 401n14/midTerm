'use strict';

const mongoose = require('mongoose');

class Model {
  constructor(schema){
    this.schema = schema;
  }

  //method for creating a user
  //also needs to create connections and chats
  create(record){
    try {
      this.schema.create(record);
    } catch (error) {
      console.error(error);
    }
  }
  

  read(query){
    //The returns from this function need to be awaited
    //let userRecord = await user.read(query);
    try {
      //If the query passed in is of type ID then we do a find by ID else we search by username
      //That way this read function can be used with ID's from chat and connection or with username from users
      if(mongoose.Types.ObjectId.isValid(query)) return this.schema.findById(query);
      else return this.schema.find({username: query});
      
    } catch (error) {
      console.error(error);
    }
  }

  //method for updating users 
  //(Do users need to be updated? Change password maybe?)

  //method for deleting users
  //(Does that delete all the chats associated with them?) <-- Stretch Goal probably
  //delete functionality once a connection is closed

  delete(_id){
    try {
      return this.schema.deleteOne({_id});
    } catch (error) {
      console.error(error);
    }
  }

}





module.exports = Model;