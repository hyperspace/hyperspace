const {getPhoenixData} = require('./phoenixTunnel.js')
const getHomePath = require('home-path')
const osascript = require('node-osascript')
const path = require('path')
const fs = require('fs')
const HOME = getHomePath()

function getNumberOfSpaces() {
  return getPhoenixData({
    message: 'SPACE',
    keystroke: 'g',
    parse: JSON.parse,
  })
}

function changeSpace(display, spaceIndex) {
  console.log('Change to space ' + spaceIndex)
  return new Promise((resolve, reject) => {
    const script = `do shell script "open -a 'Mission Control'"
      delay 0.5
      tell application "System Events" to click (first button whose value of attribute "AXDescription" is "exit to Desktop ${spaceIndex}") of list 1 of group "Spaces Bar" of group 1 of group "Mission Control" of application process "Dock"`

    osascript.execute(script, err => {
      if (err) reject(err)

      setTimeout(() => resolve(), 100)
    })
  })
}

/* module.exports =*/
async function save() {
  const projectFilePath = path.join(
    HOME,
    '.config',
    'hyperspace',
    'project-template.js',
  )

  try {
    let jsonFile = '"windows": ['
    const numSpaces = await getNumberOfSpaces()

    for (let i = 1; i <= numSpaces; i++) {
      await changeSpace(1, i)
      const data = await getPhoenixData({
        message: 'ENV',
        keystroke: 'a',
        parse: value => value.slice(1).slice(0, -1),
      })

      jsonFile += data + ','
    }

    let contentFile = `{ ${jsonFile.slice(0, -1)} ]}`

    fs.writeFileSync(projectFilePath, contentFile)
  } catch (error) {
    console.error(error)
  }
}

save()
// get the json
// save in hyperspace folder
// use template hehe
