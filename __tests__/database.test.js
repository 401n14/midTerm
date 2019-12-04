'use strict';

const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').default;
const User = require('../model/user/user-model');
const userDB = new User();
const Chat = require('../model/chat/chat-model');
const chat = new Chat();
const Connection = require('../model/connection/connection-model');
const connection = new Connection();
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
  },
  user2: {
    username: 'samuel',
    password: 'sampassword',
  },
};

let messageData = {
  message: 'Wow this app is cool',
};

let connectionData = {
  connection: '1239ashhda812837813',
};

beforeAll( async (done) => {
  await startDatabase();
  spyError.mockReset();
  await userDB.create(users.user1);
  await userDB.create(users.user2);
  await chat.create(messageData);
  await connection.create(connectionData);
  done();
});

afterAll(stopDatabase);

describe('Database CRUD functionality tests', () => {
  let userInfo;
  it('Can read a created user', async () => {
    userInfo = await userDB.read('jhon');
    expect(userInfo[0].username).toBe('jhon');
  });

  it('Can find a user based off of an ID', async () => {
    let userInfoByID = await userDB.read(userInfo[0]._id);
    expect(userInfoByID.username).toBe('jhon');
  });

  it('Create throws an error when given incorrect parameters', async () => {
    try {
      await userDB.create({user: 'sam'});
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('Can succesfully delete a User', async () => {
    let deleted = await userDB.delete(userInfo[0]._id);
    expect(deleted.deletedCount).toBe(1);
  });
  
  it('Can return the chat log', async () => {
    let logs = await chat.find();
    expect(logs[0].message).toBe('Wow this app is cool');
  });

});
