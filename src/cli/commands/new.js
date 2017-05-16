const inquirer = require('inquirer')
const chalk = require('chalk')
const open = require('open')
const writeProjectFile = require('../../save/writeProject')
const projectTemplate = require('../../configs/template-project.json')

module.exports = {
  description: 'Create new project from scratch',
  optionalArgs: 'projectName',
  handler(projectName) {
    if (projectName) {
      return newProject({ name: projectName })
    }

    return askProjectName()
  },
}

function askProjectName() {
  return getProjectDetails().then(newProject)
}

function getProjectDetails() {
  console.log('') // Format
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '🌟  Type the project name',
    },
    {
      type: 'input',
      name: 'description',
      message: '📃  Type the project description (be poetic)',
    },
  ])
}

function newProject({ name, description }) {
  return new Promise(function(resolve, reject) {
    if (name) projectTemplate.project = name
    if (description) projectTemplate.description = description
    resolve(projectTemplate)
  })
    .then(writeProjectFile(name, description))
    .then(filePath => {
      open(filePath)
    })
}
