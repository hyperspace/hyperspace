const {getPhoenixData} = require('../phoenixTunnel.js')
const getHomePath = require('home-path')
const path = require('path')
const fs = require('fs')
const HOME = getHomePath()
const {getNumberOfDisplays} = require('../lib/displays')
const {getNumberOfSpaces, changeToSpace} = require('../lib/spaces')

function save() {
  Promise.all([getNumberOfSpaces(), getNumberOfDisplays()])
    .then(([numSpaces, numDisplays]) => {
      return getAllWindows(numDisplays, numSpaces)
    })
    .then(generateProjectJson)
    .then(writeProjectFile)
    .catch(error => {
      console.error(error)
    })
}

function getAllWindows(numDisplays, numSpaces) {
  let promise = Promise.resolve([])

  for (let i = 1; i < numSpaces; i++) {
    promise = promise.then(spacesData => {
      return getWindowsInSpace(1, i).then(spaceData => {
        return spacesData.concat([spaceData])
      })
    })
  }

  return promise
}

function getWindowsInSpace(display, spaceIndex) {
  return changeToSpace(display, spaceIndex).then(() => {
    return getSpaceWindows()
  })
}

function getSpaceWindows() {
  return getPhoenixData({
    message: 'ENV',
    keystroke: 'a',
    parse: JSON.parse,
  })
}

function generateProjectJson(windows) {
  return {
    windows: windows.reduce((windows, spaceData) => {
      return windows.concat([spaceData])
    }, []),
  }
}

function writeProjectFile(projectJson) {
  const projectFilePath = path.join(
    HOME,
    '.config',
    'hyperspace',
    'project-template.js',
  )

  fs.writeFileSync(projectFilePath, JSON.stringify(projectJson))
}

save()

module.exports = save
// get the json
// save in hyperspace folder
// use template hehe
