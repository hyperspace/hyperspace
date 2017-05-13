const path = require('path')
const getHomePath = require('home-path')
const HOME = getHomePath()
const fs = require('fs')

const projectsDirPath = path.join(HOME, '.config', 'hyperspace')

module.exports = function writeProjectFile(projectName) {
  projectName = getProjectName(projectName)

  return projectJson => {
    console.log(`Write project file ${projectName}`)
    const projectFilePath = path.join(projectsDirPath, `${projectName}.js`)

    fs.writeFileSync(projectFilePath, JSON.stringify(projectJson))
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
  return fs.existsSync(path.join(projectsDirPath, `${projectName}.js`))
}
