const osascript = require('node-osascript')
const exec = require('child_process')
const {pressShortcut} = require('../phoenixTunnel')

let loopTimer

module.exports = function positionApps(project) {
  setTimeout(function() {
    console.log('Positioning apps')
    setStorage()
  }, 350 * project.windowsFormatted.length) // Not sure

  return project
}

function setStorage() {
  pressShortcut('s')

  loopTimer = setInterval(positionWaitLoop, 2000)

  // eslint-disable-next-line
  let child = exec.spawn('log', [
    'stream',
    '--style',
    'json',
    '--predicate',
    'eventMessage contains "hyperspace-DONE"',
    '--info',
  ])

  child.stdout.on('data', function() {
    clearInterval(loopTimer)
    child.kill('SIGKILL')
  })
}

const positionWaitLoop = () => {
  let appleScript =
    'tell application "System Events" to keystroke "p" using {control down, shift down}'
  osascript.execute(appleScript)
}
