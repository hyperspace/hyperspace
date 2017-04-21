const osascript = require('node-osascript')
const exec = require('child_process')

let loopTimer

module.exports = function positionApps(project) {
  console.log('Positioning apps')

  setTimeout(function() {
    setStorage()
  }, 500)

  return project
}

function setStorage() {
  let appleScript =
    'tell application "System Events" to keystroke "s" using {control down, shift down}'
  osascript.execute(appleScript)

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
