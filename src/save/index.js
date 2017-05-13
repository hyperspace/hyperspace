const {getPhoenixData} = require('../phoenixTunnel.js')
const getHomePath = require('home-path')
const {getNumberOfDisplays} = require('../lib/displays')
const {getNumberOfSpaces, changeToSpace} = require('../lib/spaces')
const pipeSaver = require('./savers/default.js')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')
const HOME = getHomePath()

function save() {
  console.log('Start snapshot process')
  Promise.all([getNumberOfSpaces(), getNumberOfDisplays()])
    .then(([numSpaces, numDisplays]) => {
      return getAllWindows(numDisplays, numSpaces)
    })
    .then(cleanJSON)
    .then(getAppFiles)
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

function cleanJSON(windows) {
  console.log('Clean up JSON format')
  windows = _.flattenDeep(windows)
  return windows
}

function getAppFiles(windows) {
  console.log('Get the app files')
  let promise = Promise.resolve([])

  for (let i = 0; i < windows.length; i++) {
    promise = promise.then(() => {
      const node = windows[i]
      return pipeSaver(node.app).then(files => {
        if (files) node.files = files
        return windows.concat([node])
      })
    })
  }

  return promise
}

function generateProjectJson(windows) {
  console.log('Generate JSON file')
  return {
    windows: windows,
  }
}

function writeProjectFile(projectJson) {
  console.log('Write project file')
  const projectFilePath = path.join(
    HOME,
    '.config',
    'hyperspace',
    'project-template.js'
  )

  fs.writeFileSync(projectFilePath, JSON.stringify(projectJson))
}

save()

module.exports = save
