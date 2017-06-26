const flattenDeep = require('lodash/flattenDeep')
const runScript = require('./save-googlechrome.appleScript')

module.exports = function() {
  return new Promise(resolve => {
    runScript(null, function(err, result) {
      if (err) {
        resolve(false)
      }
      resolve({ urls: flattenDeep(result) })
    })
  })
}
