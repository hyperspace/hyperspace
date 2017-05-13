const inquirer = require('inquirer')
const chalk = require('chalk')
const open = require('open')
const { projectsDirPath, getAllProjects } = require('../../lib/projects')

module.exports = {
  description: 'Edit a project',
  optionalArgs: 'projectName',
  handler(projectName) {
    console.log(projectName)
    if (projectName) {
      return editFile(projectName)
    }

    return askWhatProject()
  },
}

function askWhatProject() {
  return getListofProjects().then(editFile)
}

function getListofProjects() {
  return inquirer.prompt({
    type: 'list',
    name: 'project',
    message: 'Edit project',
    choices: getAllProjects().map(project => project.replace('.js', '')),
  })
}

function editFile(res) {
  open(`${projectsDirPath}/${res.project}.js`)
}
