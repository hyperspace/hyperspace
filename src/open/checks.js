module.exports = function checkAppsAndFiles(project) {
  console.log('Checking existing apps and files')

  return checkApps(project).then(checkFiles)
}

function checkApps(project) {
  return Promise.resolve(project)
}

function checkFiles(project) {
  return project
}
