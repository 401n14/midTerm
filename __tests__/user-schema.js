'use strict';

const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').default;
const User = require('../model/UserSchema.js');
//const User = require('../model/model.js');
const bcrypt = require('bcrypt');
const userDB = new User();

let mongod;
const spyError = jest.spyOn(console, 'error');

const startDatabase = async () => {
  mongod = new MongoMemoryServer();
  const uri = await mongod.getConnectionString();
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});
  } catch (error) {
    console.error(error);
  }
};

const stopDatabase = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};
let users = {
  user1: {
    username: 'jhon',
    password: 'jhonpasswordhh',
    language: 'english',
    displayName: 'BigJhon123',
  },
  user2: {
    username: 'samuel',
    password: 'sampassword',
    language: 'english',
    displayName: 'sam123',
  },
};

beforeAll( async (done) => {
  await startDatabase();
  spyError.mockReset();
  // await userDB.create(users.user1);
  // await userDB.create(users.user2);
  done();
});

afterAll(stopDatabase);

describe('User Model', () =>{

  it('Should hash password!', (done) => {
  //mock valid user input
    let userInfo = {username: 'John Wick', password: 'secret', language: 'english',
      displayName: 'BigJhon123' };
    const newUser = new User(userInfo);
    newUser.save()
      .then(user => {
        expect(user.password).not.toBe(userInfo.password);
        done();
      });
  });

});
