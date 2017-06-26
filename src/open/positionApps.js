const exec = require('child_process')
const {
  quitPhoenix,
  pressShortcut,
  positionWaitLoop,
} = require('../lib/appleScripts')

let loopTimer

module.exports = function positionApps(project) {
  setTimeout(function() {
    console.log('Positioning apps')
    setStorage()
  }, 500 * project.windowsFormatted.length) // Not sure

  return project
}

function setStorage() {
  pressShortcut('s')

  loopTimer = setInterval(positionWaitLoop, 2000)

  // eslint-disable-next-line
  let child = exec.spawn("log", [
    'stream',
    '--style',
    'json',
    '--predicate',
    'eventMessage contains "hyperspace-DONE"',
    '--info',
  ])

  child.stdout.on('data', function() {
    clearInterval(loopTimer)
    quitPhoenix()
    child.kill('SIGKILL')
  })
}
