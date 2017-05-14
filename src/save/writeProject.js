const path = require('path')
const fs = require('fs')
const osascript = require('node-osascript')
const { projectsDirPath } = require('../lib/projects')

module.exports = function writeProjectFile(projectName, description) {
  projectName = getProjectName(projectName)

  return projectJson => {
    console.log(`Write project file ${projectName}`)
    const projectFilePath = path.join(projectsDirPath, `${projectName}.json`)

    projectJson = {
      project: projectName,
      description: description,
      windows: projectJson.windows,
    }

    fs.writeFileSync(projectFilePath, JSON.stringify(projectJson, null, 2))

    let appleScript = 'quit application "Phoenix"'
    osascript.execute(appleScript)
  }
}

function getProjectName(projectName) {
  if (projectName) return projectName

  const date = new Date()
  const today = `${date.getFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
  const defaultProjectName = `${today}-project`

  return getNonConflictingName(defaultProjectName)
}

function getNonConflictingName(projectBaseName) {
  let projectName = projectBaseName

  let counter = 1
  while (projectAlreadyExist(projectName)) {
    projectName = `${projectBaseName}-${counter}`
    counter++
  }

  return projectName
}

function projectAlreadyExist(projectName) {
  return fs.existsSync(path.join(projectsDirPath, `${projectName}.json`))
}
