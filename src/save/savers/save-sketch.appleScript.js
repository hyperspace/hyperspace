const osascript = require('node-osascript')

module.exports = function runScript(options, callback) {
  const appleScript = 'tell application "Sketch" to return path of documents'
  osascript.execute(appleScript, callback)
}
