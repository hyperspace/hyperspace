const fs = require('fs')

module.exports = function checkAppsAndFiles(project) {
  console.log('Checking existing apps and files')

  return checkApps(project).then(checkFiles)
}

function checkApps(project) {
  project.windowsFormatted.map(obj => {
    const appPath = `/Applications/${obj.name}`
    const appFile = `/Applications/${obj.name}.app`
    if (!fs.existsSync(appPath) && !fs.existsSync(appFile)) {
      console.log(`The App "${appPath}" doesn't exist`)
      process.exit()
      return
    }
  })

  return Promise.resolve(project)
}

function checkFiles(project) {
  project.windowsFormatted.map(obj => {
    if (!fs.existsSync(obj.file) && obj.file) {
      console.log(`The file "${obj.file}" doesn't exist`)
      process.exit()
      return
    }
  })

  return Promise.resolve(project)
}
