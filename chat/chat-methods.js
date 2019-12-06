'use strict';

/**
 * @fileoverview chat-methods.js
 * 
 * @author Anna Li
 * @author Morgan T Shaw
 * 
 * @requires NPM:chalk
 * @requires NPM:readline
 * 
 */
const chalk = require('chalk');

const printExit = (data) =>{
  console.log(chalk.hex('#32E875').bold(`\n>>>> ${data} left the chat <<<<\n`));
};

module.exports = {printExit};