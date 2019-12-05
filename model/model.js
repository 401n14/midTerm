'use strict';
const mongoose = require('mongoose');


/**
 * Class Model is the basis for our data models. It has all of the CRUD functionality methods inside of it
 */

class Model {
/**
* The constructor of our model
* @param  {schema}   schema    A generated mongoose model
* @return {Model}              A newly created Model object
*/
  constructor(schema){
    this.schema = schema;
  }

  /**
   * Create allows us to insert a record in to the database as long as that record matches the Model's schema
   * @param {Object} record - The object representing data we would like to insert in to the collection 
   * @method
   * @returns {Promise<Object>} - The created record in the database
   * @returns {Error} - If there was an error during creation of the record this will provide more detailed documentation
   */
  create(record){
    return this.schema.create(record);
  }
  
  /**
   * Read takes in a query string, checks to see if string is a valid ID if it is then it searches by ID
   * else it searches by username
   * @method
   * @param {String} query 
   * @returns {Promise<Object>} - The record in the collection that matches the query paramaters
   * @returns {Error} - If there is no match found read will throw an error indicating that
   */
  read(query){
    //The returns from this function need to be awaited
    //let userRecord = await user.read(query);
    //If the query passed in is of type ID then we do a find by ID else we search by username
    //That way this read function can be used with ID's from chat and connection or with username from users
    if(mongoose.Types.ObjectId.isValid(query)) return this.schema.findById(query);
    else return this.schema.find({username: query});
  }
  /**
   * Updates a specific recoord with new content
   * @param {mongoose.Types.ObjectId}   _id   The id of user record we want to change
   * @param {object}                  record  The new data we want our record to be updated to
   * @return {Promise<object>}                The updated record and its contents
   */

  update(_id, record) {
    return this.schema.updateOne({ _id }, record);
  }

  
  /**
 * Delete allows us to delete a record from the collection base on an ID
 * @method
 * @param {String} _id  - The ID of the record to be deleted
 * @returns {Object} - The deleted records information
 * @returns {Error} - If there is an error during the delete process this will notify the user
 */
  delete(_id){
    return this.schema.deleteOne({_id});
  }

}





module.exports = Model;
