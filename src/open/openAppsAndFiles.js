const open = require('./openers/default')

module.exports = function openAppsAndFiles(project) {
  console.log('Opening apps and files')

  project.windowsFormatted.map(open)

  return project
}
