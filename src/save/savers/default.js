const fs = require('fs')
const runScript = require('./default.appleScript')

function pipeSaver(appName) {
  let app = appName.replace(/\s/g, '').toLowerCase()
  let saverPath = `${__dirname}/save-${app}.js`
  if (fs.existsSync(saverPath)) {
    const saver = require(saverPath)
    return saver()
  }
  return getAppOpenFiles(appName)
}

function getAppOpenFiles(appName) {
  return new Promise(resolve => {
    runScript({ appName }, function(err, result) {
      if (err) {
        // console.error(err)
        resolve(false)
      }

      resolve({ files: result })
    })
  })
}

module.exports = pipeSaver
