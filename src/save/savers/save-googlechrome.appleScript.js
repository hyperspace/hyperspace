const osascript = require('node-osascript')

module.exports = function runScript(options, callback) {
  const appleScript =
    'tell application "Google Chrome" to return URL of tabs of windows'
  osascript.execute(appleScript, callback)
}
