const path = require('path')
const fs = require('fs')
const open = require('open')
const getHomePath = require('home-path')
const HOME = getHomePath()
const projectTemplate = require('../configs/template-project.json')
const { quitPhoenix } = require('./appleScripts')

const projectsDirPath = path.join(HOME, '.config', 'hyperspace')

function getAllProjects() {
  if (!fs.existsSync(projectsDirPath)) return []
  return fs
    .readdirSync(projectsDirPath)
    .filter(file => file.indexOf('.DS_Store') === -1)
    .filter(file => file.indexOf('configs.json') === -1)
}

function createNewProject({ name, description }) {
  return new Promise(function(resolve) {
    if (name) projectTemplate.project = name
    if (description) projectTemplate.description = description
    resolve(projectTemplate)
  })
    .then(writeProjectFile(name, description))
    .then(filePath => {
      open(filePath)
    })
}

function writeProjectFile(projectName, description) {
  projectName = getProjectName(projectName)

  return projectJson => {
    const projectFilePath = path.join(projectsDirPath, `${projectName}.json`)
    console.log(`Write project file ${projectFilePath}`)

    // prettier-ignore
    const jsonFile = Object.assign(
      {
        project: projectName,
        description: description,
      },
      projectJson
    )

    fs.writeFileSync(projectFilePath, JSON.stringify(jsonFile, null, 2))

    quitPhoenix()

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

module.exports = {
  projectsDirPath,
  getAllProjects,
  createNewProject,
  writeProjectFile,
}
