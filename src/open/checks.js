const fs = require('fs')
const path = require('path')

module.exports = function checkAppsAndFiles(project) {
  console.log('Checking existing apps and files')

  return checkApps(project).then(checkFiles)
}

function checkApps(project) {
  project.windowsFormatted.map(obj => {
    const appPath = path.join('/', 'Applications', obj.name)
    const appFile = path.join('/', 'Applications', `${obj.name}.app`)

    const appExists = fs.existsSync(appPath) || fs.existsSync(appFile)
    if (appExists === false) {
      console.log(`The app "${appPath}" doesn't exist`)
      process.exit()
      return
    }
  })

  return Promise.resolve(project)
}

function checkFiles(project) {
  project.windowsFormatted.map(obj => {
    const fileExists = obj.file && fs.existsSync(obj.file)
    if (fileExists === false) {
      console.log(`The file "${obj.file}" doesn't exist`)
      process.exit()
      return
    }
  })

  return Promise.resolve(project)
}
