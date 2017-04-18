import open from 'open'
import _ from 'lodash'
import fs from 'fs'
import osascript from 'node-osascript'
import project from './src/mocks/project-template.json'
import * as exec from 'child_process'

let loopTimer

/*
    Helpers
*/

const openFiles = (file, item) => {
  const app = {
    name: item.app,
    pos: item.position,
    space: item.space,
    display: item.display,
  }

  open(file, app.name, (error) => {
    if (error) {
      let msg = error.toString().split('\n')
      console.log(msg[1])

      return
    }
  })

  return app
}

/*
    Get Informations
*/

const getPhoenixData = (args) => {
  return new Promise((resolve, reject) => {
    let appleScript = `tell application "System Events" to keystroke "${args.keystroke}" using {control down, shift down}`
    osascript.execute(appleScript)

    let child = exec.spawn("log", ['stream', "--style", "json", "--predicate", `eventMessage contains "${args.message}"`, "--info"])

    child.stdout.on('data', function (data) {
      const message = JSON.parse(data.toString()).eventMessage
      const result = args.parse( message.split(":")[1] )
      child.kill('SIGKILL')
      resolve(result)
    })
  })
}

const writePhoenixObject = (object) => {
  const template = fs.readFileSync('./src/template/appTemp.js', 'utf8')
  const render = _.template(template)
  const file = render(object)

  // FIX: Hard-code
  fs.writeFileSync('/Users/zehfernandes/.config/phoenix/appTemp.js', file)

  // Time to open windows files (fail safe)
  setTimeout(function() { setStorage() }, 500)
}

const setStorage = () => {
  let appleScript = 'tell application "System Events" to keystroke "s" using {control down, shift down}'
  osascript.execute(appleScript)

  loopTimer = setInterval(positionWaitLoop, 2000)

  // eslint-disable-next-line
  let child = exec.spawn("log", ['stream', "--style", "json", "--predicate", "eventMessage contains \"DONE\"", "--info"])

  child.stdout.on('data', function () {
    clearInterval(loopTimer)
    child.kill('SIGKILL')
  })
}

const positionWaitLoop = () => {
  let appleScript = 'tell application "System Events" to keystroke "p" using {control down, shift down}'
  osascript.execute(appleScript)
}

getPhoenixData( {
    message: "DISPLAY", keystroke: "d",
    parse: (value) => parseInt(value)
  }
).then((data) => {
  console.log("Yay! " + data);
})

getPhoenixData(
  {
    message: "SPACE", keystroke: "g",
    parse: (value) => value.replace(/[\[\]']+/g, '').split(',')
  }
).then((data) => {
  console.log("Yay! " + data);
})

/*
    Controler
*/

const windows = project.windows
const windowsConfigs = []

windows.forEach((item) => {
  item.files.forEach((file) => {
    let window = openFiles(file, item)
    windowsConfigs.push(window)
  })
})

writePhoenixObject({ windows: windowsConfigs})
