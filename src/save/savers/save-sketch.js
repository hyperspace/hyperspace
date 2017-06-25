const runScript = require('./save-sketch.appleScript')

module.exports = function() {
  return new Promise(resolve => {
    runScript(null, function(err, result) {
      if (err) {
        resolve(false)
      }
      resolve({ files: result })
    })
  })
}
