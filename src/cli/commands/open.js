const inquirer = require('inquirer')
const chalk = require('chalk')
const open = require('../../open/index')
const { projectsDirPath, getAllProjects } = require('../../lib/projects')

module.exports = {
  description: 'Open a project',
  optionalArgs: 'projectName',
  handler(projectName) {
    if (projectName) {
      if (projectName.split('.').pop() === 'json') { return openProject(projectName) }

      return openProject({ project: projectName })
    }

    return askWhatProject()
  },
}

function askWhatProject() {
  return getListofProjects().then(openProject)
}

function getListofProjects() {
  return inquirer.prompt({
    type: 'list',
    name: 'project',
    message: chalk.bold('What project do you want to travel?'),
    choices: getAllProjects().map(project => project.replace('.json', '')),
  })
}

function openProject(res) {
  return new Promise(function(resolve, reject) {
    let filePath = `${projectsDirPath}/${res.project}.json`
    if (typeof res != 'object') {
      filePath = res
    }

    project = require(filePath)

    open(project)
  })
}
