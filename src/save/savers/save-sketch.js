const osascript = require('node-osascript')

module.exports = function() {
  return new Promise(resolve => {
    const appleScript = 'tell application "Sketch" to return path of documents'
    osascript.execute(appleScript, function(err, result, raw) {
      if (err) {
        resolve(false)
      }
      resolve(result)
    })
  })
}
