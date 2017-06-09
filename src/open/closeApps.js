const fs = require('fs')
const path = require('path')
const getHomePath = require('home-path')
const osascript = require('node-osascript')

const HOME = getHomePath()

module.exports = function closeApps(project) {
  console.log('Closing apps')
  let whiteList = getWhiteList(project)

  return new Promise(resolve => {
    const appleScript = `tell application "System Events" to set the visible of every process to true

    set white_list to {${whiteList}}

    tell application "System Events"
      set process_list to the name of every process whose visible is true

      repeat with i from 1 to (number of items in process_list)
        set this_process to item i of the process_list
        if this_process is not in white_list then
          tell application this_process
            try
              close (every window)
              delay 0.2
            end try
          end tell
          try
            set ThePID to unix id of process this_process
            do shell script "kill -KILL " & ThePID
            delay 0.5
          end try
        end if
      end repeat
      delay 0.5
    end tell

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

function getWhiteList(project) {
  let whiteList = ''
  const configs = require(`${HOME}/.config/hyperspace/configs.json`)

  if (configs.keepApps) whiteList = `"${configs.keepApps.join('","')}"`
  if (project.keepApps) whiteList = `"${project.keepApps.join('","')}"`

  return whiteList
}
