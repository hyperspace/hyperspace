const {getPhoenixData} = require('./phoenixTunnel.js')
const getHomePath = require('home-path')
const path = require('path')
const fs = require('fs')
const HOME = getHomePath()
const {getNumberOfSpaces, changeToSpace} = require('../lib/spaces')

function getSpaceWindows() {
  return getPhoenixData({
    message: 'ENV',
    keystroke: 'a',
    parse: value => value.slice(1).slice(0, -1),
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
      await changeToSpace(1, i)
      const data = await getSpaceWindows()

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
