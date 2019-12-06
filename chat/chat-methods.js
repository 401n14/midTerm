'use strict';

/**
 * @fileoverview chat-methods.js
 * 
 * @author Anna Li
 * @author Morgan T Shaw
 * 
 * @requires NPM:chalk * 
 */
const chalk = require('chalk');

/**
 * @function printExit
 * @param {string} data username of the person leaving the chat
 * This will console log \n>>>> ${data} left the chat <<<<\n
 */
const printExit = (data) =>{
  console.log(chalk.hex('#32E875').bold(`\n>>>> ${data} left the chat <<<<\n`));
};

/**
 * This function will use built in JS methods to create a random hex color
 * @function getRandomColor
 * @returns {string} random color string
 */
function getRandomColor() {
  return '#' + parseInt(Math.random() * 0xffffff).toString(16);
}

/**
 * This will console log 'Current Users: ' + users'
 * @function printUsers
 * @param {object} users 
 */
const printUsers = (users)=>{
  console.log(chalk.hex('#FF9F1C')('Current Users: ' + users));
};

/**
 * This will console log '>>>> ${data} joined the chat <<<<'
 * @function printNewUser
 * @param {string} data username of the person joining the chat 
 */
const printNewUser = (data)=>{
  console.log(typeof data);
  console.log(
    chalk.hex('#32E875').bold(`\n>>>> ${data} joined the chat <<<<\n`),
  );
};

/**
 * @function printMessage
 * @param {object} data 
 * will console log '${data.color} ).bold( ${data.user} (${data.language}): ) + ${data.message} '
 */
const printMessage = (data)=>{

  console.log(chalk.hex(`${data.color}`).bold(`${data.user} (${data.language}): `) + `${data.message}`);

};

module.exports = {printExit, getRandomColor, printUsers, printNewUser, printMessage};