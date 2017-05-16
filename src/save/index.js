const { getPhoenixData } = require('../phoenixTunnel.js')
const { getNumberOfDisplays } = require('../lib/displays')
const { getNumberOfSpaces, changeToSpace } = require('../lib/spaces')
const pipeSaver = require('./savers/default.js')
const flattenDeep = require('lodash/flattenDeep')
const writeProjectFile = require('./writeProject')

function save(projectName, description) {
  console.log('Start snapshot process...')

  return Promise.all([getNumberOfSpaces(), getNumberOfDisplays()])
    .then(([numSpaces, numDisplays]) => {
      return getAllWindows(numDisplays, numSpaces)
    })
    .then(cleanJSON)
    .then(getAppFiles)
    .then(generateProjectJson)
    .then(writeProjectFile(projectName, description))
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

  let changeDisplay = numSpaces[0]
  for (let i = 1; i <= allSpaces; i++) {
    promise = promise.then(spacesData => {
      return getWindowsInSpace(indexDisplay, i).then(spaceData => {
        if (i === changeDisplay) {
          indexDisplay++
          changeDisplay = changeDisplay + numSpaces[indexDisplay - 1]
        }
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
  return flattenDeep(windows)
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
  return { windows }
}

module.exports = save
