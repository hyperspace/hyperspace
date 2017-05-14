const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const { projectsDirPath, getAllProjects } = require('../../lib/projects')

module.exports = {
  description: 'Delete a project',
  optionalArgs: 'projectName',
  handler(projectName) {
    if (projectName) {
      return deleteFile({ project: projectName })
    }

    return askWhatProject()
  },
}

function askWhatProject() {
  return getListofProjects().then(deleteFile)
}

function getListofProjects() {
  return inquirer.prompt({
    type: 'list',
    name: 'project',
    message: chalk.bold('Delete project'),
    choices: getAllProjects().map(project => project.replace('.json', '')),
  })
}

function deleteFile(res) {
  return new Promise(function(resolve, reject) {
    fs.unlinkSync(`${projectsDirPath}/${res.project}.json`)
    console.log('')
    console.log(`Project ${res.project} was removed`)
  })
}
