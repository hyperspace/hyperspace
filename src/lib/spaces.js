const osascript = require('node-osascript')
const { getPhoenixData } = require('../phoenixTunnel')
const chalk = require('chalk')

function createSpaces(quantity, display) {
  console.log(`Creating ${quantity} spaces at ${display}`)
  return new Promise((resolve, reject) => {
    const script = `do shell script "open -a 'Mission Control'"
  delay 0.5
  repeat ${quantity} times
  tell application "System Events" to click of UI element 2 of UI element 2 of UI element ${display} of group 1 of process "Dock"
  end repeat`

    osascript.execute(script, err => {
      if (err) {
        printError(err)
        return reject(err)
      }

      setTimeout(() => {
        osascript.execute('tell application "System Events" to key code 53')
        resolve()
      }, 300)
    })
  })
}

function removeSpaces(quantity, display) {
  console.log(`Close ${quantity} spaces at ${display}`)
  return new Promise((resolve, reject) => {
    const script = `do shell script "open -a 'Mission Control'"
  delay 0.5
  repeat with i from ${quantity} to 1 by -1
    tell application "System Events" to perform action "AXRemoveDesktop" of button i of list 1 of group "Spaces Bar" of group ${display} of group "Mission Control" of application process "Dock"
  end repeat`

    osascript.execute(script, err => {
      if (err) {
        printError(err)
        return reject(err)
      }

      setTimeout(() => {
        osascript.execute('tell application "System Events" to key code 53')
        resolve()
      }, 300)
    })
  })
}

function changeToSpace(display, spaceIndex) {
  console.log('Change to space ' + spaceIndex + ' from display ' + display)
  return new Promise((resolve, reject) => {
    const script = `do shell script "open -a 'Mission Control'"
      delay 0.5
      tell application "System Events" to click (first button whose "${spaceIndex}" is in value of attribute "AXDescription") of list 1 of group 2 of group ${display} of group "Mission Control" of application process "Dock"
      delay 0.1
      tell application "System Events" to key code 53`

    osascript.execute(script, err => {
      if (err) {
        printError(err)
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

    osascript.execute('tell application "System Events" to key code 53')
    process.exit()
  }
}

module.exports = {
  createSpaces,
  changeToSpace,
  getNumberOfSpaces,
  removeSpaces,
}
