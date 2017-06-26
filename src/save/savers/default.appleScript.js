const osascript = require('node-osascript')

module.exports = function getAppOpenFiles(options = {}, callback) {
  const script = `tell application "${options.appName}"
	    set docFiles to file of documents
	    set fileArray to {}
	    repeat with t in docFiles
		    if t is not in {{}, {""}, "", missing value} then
			    set the |fileArray| to the |fileArray| & POSIX path of t
		    end if
	    end repeat
	    return fileArray
    end tell`
  osascript.execute(script, callback)
}
