const osascript = require('node-osascript')
const {getPhoenixData} = require('../phoenixTunnel')

module.exports = function createNecessarySpaces(project) {
  console.log('Creating necessary spaces')

  return Promise.all([
    getNumberOfSpaces(),
    getRequiredSpaces(project),
  ]).then(([numberOfSpaces, requiredSpaces]) => {
    if (numberOfSpaces < requiredSpaces) {
      return createSpaces(requiredSpaces - numberOfSpaces).then(() => project)
    }

    return project
  })
}

function getNumberOfSpaces() {
  return getPhoenixData({
    message: 'SPACE',
    keystroke: 'g',
    parse: JSON.parse,
  })
}

function getRequiredSpaces(project) {
  return project.windows.reduce((numberOfSpaces, window) => {
    return Math.max(numberOfSpaces, window.space)
  }, 1)
}

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
