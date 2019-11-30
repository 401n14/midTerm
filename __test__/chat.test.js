'use strict';

const chat = require('../chat/chat.js'),
  io = require('socket.io-client'),
  io_chat = require('socket.io').listen(3000);

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

jest.setTimeout(50000);
  


describe('Suite of unit tests', function() {

  let socket;
  let answer = 'test2';

  beforeEach(function(done) {
    // Setup
    socket = io.connect('http://localhost:3000', {
      'reconnection delay' : 0
      , 'reopen delay' : 0
      , 'force new connection' : true,
    });
    //socket.on('connect', function() {
    socket.on('connect', ()=> {
      console.log(`${answer} joined the chat!`);
      done();
    });
    socket.on('disconnect', function() {
      console.log(`User left the chat`);
    });
  });

  afterEach(function(done) {
    // Cleanup
    if(socket.connected) {
      console.log('disconnecting...');
      socket.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log('no connection to break...');
    }
    done();
  });

  describe('Message Events', ()=> {
  
    it('Clients should receive a message when the `message` event is emited.', function(done) {
      let username = 'Test2';
      socket.emit('username', {username: username});
      socket.on('line', function(message) {
        console.log(`${username} joind the chat!`);
        expect(message).toEqual(`${username} joind the chat!`);
        done();
        jest.setTimeout(30000);
      });
    });
  
    it('can send message', async()=>{
      let msg = 'hello world!';
      
      let client1 =  await io_chat;
      rl.on('line', (message) => {
        client1.emit('message', message);
        console.log(message);
        //client1.emit('message', {user: test, message: 'joind team'});
        expect(message).toEqual(msg);
        jest.setTimeout(30000);
     
      });
    
    });

  });

});


      



     