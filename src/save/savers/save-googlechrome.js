const osascript = require('node-osascript')
const flattenDeep = require('lodash/flattenDeep')

module.exports = function() {
  return new Promise(resolve => {
    const appleScript =
      'tell application "Google Chrome" to return URL of tabs of windows'
    osascript.execute(appleScript, function(err, result, raw) {
      if (err) {
        resolve(false)
      }
      resolve({ urls: flattenDeep(result) })
    })
  })
}
