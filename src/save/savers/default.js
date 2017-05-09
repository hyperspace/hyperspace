const osascript = require('node-osascript')
const fs = require('fs')

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
    const appleScript = `tell application "${appName}"
	    set docFiles to file of documents
	    set fileArray to {}
	    repeat with t in docFiles
		    if t is not in {{}, {""}, "", missing value} then
			    set the |fileArray| to the |fileArray| & POSIX path of t
		    end if
	    end repeat
	    return fileArray
    end tell`
    osascript.execute(appleScript, function(err, result, raw) {
      if (err) {
        // console.error(err)
        resolve(false)
      }

      resolve(result)
    })
  })
}

module.exports = pipeSaver
