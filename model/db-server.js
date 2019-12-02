'use strict';

require('dotenv').config();
module.exports = exports = {};

const mongoose = require('mongoose');

//This function connects to our MONGODB using environment variables
//It is exported so that we can use it in a server start function
exports.connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

