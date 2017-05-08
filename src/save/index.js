const {getPhoenixData} = require('../phoenixTunnel.js')
const getHomePath = require('home-path')
const path = require('path')
const fs = require('fs')
const HOME = getHomePath()
const {getNumberOfDisplays} = require('../lib/displays')
const {getNumberOfSpaces, changeToSpace} = require('../lib/spaces')

function save() {
  console.log('Start snapshot process')
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
  console.log('Get all windows')
  let promise = Promise.resolve([])
  let indexDisplay = 1
  let allSpaces = numSpaces.reduce(function(a, b) {
    return a + b
  })

  for (let i = 1; i <= allSpaces; i++) {
    promise = promise.then(spacesData => {
      return getWindowsInSpace(indexDisplay, i).then(spaceData => {
        if (i === numSpaces[indexDisplay - 1]) indexDisplay++
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
  console.log('Generate JSON file')
  return {
    windows: windows.reduce((windows, spaceData) => {
      return windows.concat([spaceData])
    }, []),
  }
}

function writeProjectFile(projectJson) {
  console.log('Write project file')
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
