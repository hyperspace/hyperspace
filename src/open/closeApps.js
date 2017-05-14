const osascript = require('node-osascript')

module.exports = function closeApps(project) {
  console.log('Closing apps')
  // TODO: close all windows before close the app
  const whiteList = `"${project.keepApps.join('","')}"`
  return new Promise(resolve => {
    const appleScript = `tell application "System Events" to set the visible of every process to true

    set white_list to {${whiteList}}

    tell application "Finder"
      set process_list to the name of every process whose visible is true
    end tell
    repeat with i from 1 to (number of items in process_list)
      set this_process to item i of the process_list
      if this_process is not in white_list then
        tell application this_process
          try
            close (every window)
            delay 0.5
          end try
          quit
        end tell
      end if
    end repeat
    delay 0.5
    tell application "Finder" to activate
    `

    osascript.execute(appleScript, function(err, result, raw) {
      if (err) {
        console.error(err)
        return
      }

      setTimeout(() => resolve(project), 200)
    })
  })
}
