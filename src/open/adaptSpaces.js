const {createSpaces, getNumberOfSpaces} = require('../lib/spaces')

module.exports = function createNecessarySpaces(project) {
  console.log('Creating necessary spaces')

  return Promise.all([
    getNumberOfSpaces(),
    getRequiredSpaces(project),
  ]).then(([numberOfSpaces, requiredSpaces]) => {
    if (numberOfSpaces < requiredSpaces) {
      return createSpaces(requiredSpaces - numberOfSpaces).then(() => project)
    }

    return project
  })
}

function getRequiredSpaces(project) {
  return project.windows.reduce((numberOfSpaces, window) => {
    return Math.max(numberOfSpaces, window.space)
  }, 1)
}
