const adaptProjectToAvailableDisplays = require('./adaptDisplays')
const createNecessarySpaces = require('./adaptSpaces')
const checkAppsAndFiles = require('./checks')
const closeApps = require('./closeApps')
const processProjectWindows = require('./projectWindows')
const openAppsAndFiles = require('./openAppsAndFiles')
const writePhoenixProjectFile = require('./phoenixProjectFormatter')
const cleanUp = require('./cleanUp')
const positionApps = require('./positionApps')

module.exports = function open(project) {
  console.log('Opening project', project.project)

  return adaptProjectToAvailableDisplays(project)
    .then(createNecessarySpaces)
    .then(checkAppsAndFiles)
    .then(closeApps)
    .then(processProjectWindows)
    .then(openAppsAndFiles)
    .then(writePhoenixProjectFile)
    .then(cleanUp)
    .then(positionApps)
    .catch(e => console.error(e))
}
