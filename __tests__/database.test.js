'use strict';

const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').default;
const User = require('../model/user/user-model');
const userDB = new User();
// const Chat = require('../model/chat/chat-model');

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
beforeAll( async (done) => {
  await startDatabase();
  spyError.mockReset();
  await userDB.create(users.user1);
  await userDB.create(users.user2);
  done();
});

afterAll(stopDatabase);

describe('Database CRUD functionality tests', () => {
  let userInfo;
  it('Can read a created user', async () => {
    userInfo = await userDB.read('jhon');
    console.log(userInfo);
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
      // expect(spyError).toHaveBeenCalled();
      expect(error).toBeDefined();
    }
  });
  xit('Throws an error when given incorrect parameters', async () => {
    try {
      await userDB.read([123131]);
    } catch (error) {
      expect(spyError).toHaveBeenCalled();
      expect(error).toBeDefined();
    }
  });

  xit('', async () => {});
  xit('', async () => {});
});