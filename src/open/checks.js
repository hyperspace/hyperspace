const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec

module.exports = function checkAppsAndFiles(project) {
  console.log('Checking existing apps and files')

  return checkApps(project).then(checkFiles)
}

function findBybundleIdentifier(obj) {
  return new Promise((resolve, reject) => {
    let cmd = `mdfind "kMDItemCFBundleIdentifier = '${obj.bundleIdentifier}'"`
    exec(cmd, function(error, stdout, stderr) {
      if (stdout === '') {
        console.log(`The app "${obj.name}" doesn't exist`)
        process.exit()
      }

      obj.appPath = stdout.replace(/\n$/, '')
      resolve(obj)
    })
  })
}

function findByappName(obj) {
  return new Promise((resolve, reject) => {
    // TODO: busca recursiva
    const appPath = path.join('/', 'Applications', obj.name)
    const appFile = path.join('/', 'Applications', `${obj.name}.app`)

    const appExists = fs.existsSync(appPath) || fs.existsSync(appFile)
    if (appExists === false) {
      console.log(`The app "${appPath}" doesn't exist`)
      process.exit()
    }

    let cmd = `mdls -name kMDItemCFBundleIdentifier -r "${appFile}"`
    exec(cmd, function(error, stdout, stderr) {
      obj.bundleIdentifier = stdout
      resolve(obj)
    })
  })
}

// if (window.appPath) obj.appPath = window.appPath
// if (window.bundleIdentifier) obj.bundleIdentifier = window.bundleIdentifier

function checkApps(project) {
  const actions = project.windowsFormatted.map(obj => {
    if (obj.bundleIdentifier) {
      return findBybundleIdentifier(obj)
    }
    return findByappName(obj)
  })

  var results = Promise.all(actions)

  return Promise.resolve(
    results.then(data => {
      project.windowsFormatted = data
      return project
    })
  )
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
