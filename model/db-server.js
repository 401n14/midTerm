'use strict';

require('dotenv').config();
module.exports = exports = {};

const mongoose = require('mongoose');

/**
 * The connect function connects to our MONGODB using environment variables
 * 
 */
exports.connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    //Options for queries that are reccomended on the mongoose website
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

