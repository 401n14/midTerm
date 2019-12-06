'use strict';

const chatMethods = require('../chat/chat-methods');

const spy = jest.spyOn(console, 'log');

describe('Chat methods', () => {
  it('Console logs when users leave the chat', () => {
    const spy = jest.spyOn(console, 'log');
    chatMethods.printExit('Sarah Smalls');

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('Generates a random color', () => {
    let color = chatMethods.getRandomColor();

    expect(color).toBeDefined();
  });

  it('Console logs users in the chat', () => {
    const spy = jest.spyOn(console, 'log');
    chatMethods.printUsers(['  Sarah', '  Bob']);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('Console logs when a new user joins the chat', () => {
    const spy = jest.spyOn(console, 'log');
    chatMethods.printNewUser('Rene');

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('Console logs messages to users', () => {
    const spy = jest.spyOn(console, 'log');
    chatMethods.printMessage( { user: ' Sarah', color: '#8c8a17', message: 'hi', language: 'en' });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('Console logs chat history header', () => {
    const spy = jest.spyOn(console, 'log');
    chatMethods.printChatHistory('Chat history');

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('Console logs previous chats', () => {
    const spy = jest.spyOn(console, 'log');
    chatMethods.printChats({
      timestamp: '2019-12-06T05:48:20.491Z',
      user: ' Sarah',
      message: 'Hello!',
    });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();  
  });
});