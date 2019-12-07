'use strict';

const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');
const serverMethods = require('../server/server-methods');

describe('The functionality of server-methods', () => {
  it('Properly sets the socket username', () => {
    serverMethods.setUsername(socket, {
      username: 'Bob',
    });
    expect(socket.username).toBe(' Bob');
  });
  it('Properly sets the socket language', () => {
    serverMethods.setLanguage(socket, {
      language: 'Hello',
    });
    expect(socket.language).toBe('en');
  });
});