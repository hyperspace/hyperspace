const { getPhoenixData } = require('../phoenixTunnel')
const chalk = require('chalk')
const appleScripts = require('./appleScripts')

function createSpaces(quantity, display) {
  console.log(`Creating ${quantity} spaces at ${display}`)
  return new Promise((resolve, reject) => {
    appleScripts.createSpaces({ quantity, display }, err => {
      if (err) {
        printError(err)
        return reject(err)
      }

      setTimeout(() => {
        appleScripts.pressQuit()
        resolve()
      }, 300)
    })
  })
}

function removeSpaces(quantity, display) {
  console.log(`Close ${quantity} spaces at ${display}`)
  return new Promise((resolve, reject) => {
    appleScripts.removeSpaces({ quantity, display }, err => {
      if (err) {
        printError(err)
        return reject(err)
      }

      setTimeout(() => {
        appleScripts.pressQuit()
        resolve()
      }, 300)
    })
  })
}

function changeToSpace(display, index) {
  console.log('Change to space ' + index + ' from display ' + display)
  return new Promise((resolve, reject) => {
    appleScripts.changeToSpace({ display, index }, err => {
      if (err) {
        return reject(err)
      }

      setTimeout(() => resolve(), 300)
    })
  })
}

function getNumberOfSpaces() {
  return getPhoenixData({
    message: 'SPACE',
    keystroke: 'g',
    parse: JSON.parse,
  })
}

function printError(err) {
  if (err.toString().includes('(-1728)')) {
    console.log(chalk.red.bold('\nYou need to allow accessibility access'))
    console.log(
      'Go to System Preferences > Security & Privacy > Privacy > Accessibility'
    )
    console.log('And check your terminal app and the Phoenix.app')

    appleScripts.pressQuit()
    process.exit()
  }
}

module.exports = {
  createSpaces,
  changeToSpace,
  getNumberOfSpaces,
  removeSpaces,
  printError,
}
