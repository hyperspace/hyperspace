const osascript = require('node-osascript')

function getAppOpenFiles(appName) {
  return new Promise(resolve => {
    const appleScript = `tell application "${appName}" to return file of document 1`

    osascript.execute(appleScript, function(err, result, raw) {
      console.log(result)
    })
  })
}

getAppOpenFiles('Keynote')
