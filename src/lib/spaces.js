const osascript = require('node-osascript')
const {getPhoenixData} = require('../phoenixTunnel')

function createSpaces(quantity) {
  return new Promise((resolve, reject) => {
    const script = `do shell script "open -a 'Mission Control'"
  delay 0.5
  repeat ${quantity} times
  tell application "System Events" to click of UI element 2 of UI element 2 of UI element 1 of group 1 of process "Dock"
  end repeat
  delay 0.1
  tell application "System Events" to key code 53`

    osascript.execute(script, err => {
      if (err) reject(err)

      setTimeout(() => resolve(), 100)
    })
  })
}

function changeToSpace(display, spaceIndex) {
  console.log('Change to space ' + spaceIndex)
  return new Promise((resolve, reject) => {
    const script = `do shell script "open -a 'Mission Control'"
      delay 0.5
      tell application "System Events" to click (first button whose value of attribute "AXDescription" is "exit to Desktop ${spaceIndex}") of list 1 of group "Spaces Bar" of group 1 of group "Mission Control" of application process "Dock"`

    osascript.execute(script, err => {
      if (err) reject(err)

      setTimeout(() => resolve(), 100)
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

module.exports = {
  createSpaces,
  changeToSpace,
  getNumberOfSpaces,
}
