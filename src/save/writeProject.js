const path = require('path')
const fs = require('fs')
const osascript = require('node-osascript')
const { projectsDirPath } = require('../lib/projects')

module.exports = function writeProjectFile(projectName, description) {
  projectName = getProjectName(projectName)

  return projectJson => {
    const projectFilePath = path.join(projectsDirPath, `${projectName}.json`)
    console.log(`Write project file ${projectFilePath}`)

    const jsonFile = Object.assign(
      {
        project: projectName,
        description: description,
      },
      projectJson,
    )

    fs.writeFileSync(projectFilePath, JSON.stringify(jsonFile, null, 2))

    let appleScript = 'quit application "Phoenix"'
    osascript.execute(appleScript)

    return Promise.resolve(projectFilePath)
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
