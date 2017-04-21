const exec = require('child_process')
const osascript = require('node-osascript')

function getPhoenixData({message, keystroke, parse}) {
  return new Promise(resolve => {
    pressShortcut(keystroke)

    // eslint-disable-next-line
    let child = exec.spawn('log', [
      'stream',
      '--style',
      'json',
      '--predicate',
      `eventMessage contains "hyperspace-${message}"`,
      '--info',
    ])

    child.stdout.on('data', function(data) {
      const message = JSON.parse(data.toString()).eventMessage
      const result = parse(message.split('||')[1])
      child.kill('SIGKILL')
      resolve(result)
    })
  })
}

function pressShortcut(keystroke) {
  const appleScript = `tell application "System Events" to keystroke "${keystroke}" using {control down, shift down}`
  osascript.execute(appleScript)
}

module.exports = {
  getPhoenixData,
  pressShortcut,
}
