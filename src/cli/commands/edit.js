const inquirer = require('inquirer')
const chalk = require('chalk')
const open = require('open')
const { projectsDirPath, getAllProjects } = require('../../lib/projects')

module.exports = {
  description: 'Edit a project',
  optionalArgs: 'projectName',
  handler(projectName) {
    if (projectName) {
      return editFile({ project: projectName })
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
    message: chalk.bold('Edit project'),
    choices: getAllProjects().map(project => project.replace('.json', '')),
  })
}

function editFile(res) {
  return new Promise(function(resolve, reject) {
    open(`${projectsDirPath}/${res.project}.json`)
  })
}
