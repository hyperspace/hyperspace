const osascript = require('node-osascript')
const {
  createSpaces,
  getNumberOfSpaces,
  removeSpaces,
} = require('../lib/spaces')

module.exports = function createNecessarySpaces(project) {
  console.log('Creating necessary spaces')

  return Promise.all([
    getNumberOfSpaces(),
    getRequiredSpaces(project),
  ]).then(([numberOfSpaces, requiredSpaces]) => {
    let resolvePromises = []
    for (var i = 0; i < numberOfSpaces.length; i++) {
      if (numberOfSpaces[i] < requiredSpaces[i]) {
        resolvePromises.push(
          createSpaces(requiredSpaces[i] - numberOfSpaces[i], i + 1)
        )
      } else if (numberOfSpaces[i] > requiredSpaces[i]) {
        resolvePromises.push(
          removeSpaces(numberOfSpaces[i] - requiredSpaces[i], i + 1)
        )
      }
    }

    return Promise.all(resolvePromises).then(() => {
      osascript.execute('tell application "System Events" to key code 53')
      return project
    })
  })
}

function getRequiredSpaces(project) {
  // TODO: Refactor this function to return space by display
  let requireSpace = []
  project.windows.forEach(function(window) {
    requireSpace[window.display - 1] = typeof requireSpace[
      window.display - 1
    ] !== 'undefined'
      ? Math.max(requireSpace[window.display - 1], window.space)
      : parseInt(window.space)
  })

  return requireSpace
}
