const osascript = require('node-osascript')

function pressQuit(options = {}, callback) {
  const script = 'tell application "System Events" to key code 53'
  osascript.execute(script, callback)
}

function quitPhoenix(options = {}, callback) {
  const script = 'quit application "Phoenix"'
  osascript.execute(script, callback)
}

function positionWaitLoop(options = {}, callback) {
  const script =
    'tell application "System Events" to keystroke "p" using {control down, shift down}'
  osascript.execute(script, callback)
}

function pressShortcut(keystroke, callback) {
  const script = `tell application "System Events" to keystroke "${keystroke}" using {control down, shift down}`
  osascript.execute(script, callback)
}

function createSpaces(options = { quantity: 1, display: 1 }, callback) {
  const script = `do shell script "open -a 'Mission Control'"
    delay 0.5
    repeat ${options.quantity} times
    tell application "System Events" to click of UI element 2 of UI element 2 of UI element ${options.display} of group 1 of process "Dock"
    end repeat`

  osascript.execute(script, callback)
}

function removeSpaces(options = { quantity: 1, display: 1 }, callback) {
  const script = `do shell script "open -a 'Mission Control'"
  delay 0.5
  repeat with i from ${options.quantity} to 1 by -1
    tell application "System Events" to perform action "AXRemoveDesktop" of button i of list 1 of group "Spaces Bar" of group ${options.display} of group "Mission Control" of application process "Dock"
  end repeat`

  osascript.execute(script, callback)
}

function changeToSpace(options = { index: 1, display: 1 }, callback) {
  const script = `do shell script "open -a 'Mission Control'"
      delay 0.5
      tell application "System Events" to click (first button whose "${options.index}" is in value of attribute "AXDescription") of list 1 of group 2 of group ${options.display} of group "Mission Control" of application process "Dock"
      delay 0.1
      tell application "System Events" to key code 53`

  osascript.execute(script, callback)
}

function closeApps(options = { whiteList: '' }, callback) {
  const script = `tell application "System Events" to set the visible of every process to true

    set white_list to {${options.whiteList}}

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

  osascript.execute(script, callback)
}

module.exports = {
  pressQuit,
  quitPhoenix,
  positionWaitLoop,
  pressShortcut,
  createSpaces,
  removeSpaces,
  changeToSpace,
  closeApps,
}
