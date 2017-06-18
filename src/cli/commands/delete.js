const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const { projectsDirPath, getAllProjects } = require('../../index')

module.exports = {
  description: 'Remove the project of your destination panel',
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
    message: chalk.bold('\nRemove your project from the destination panel'),
    choices: getAllProjects().map(project => project.replace('.json', '')),
  })
}

function deleteFile(res) {
  return new Promise(function(resolve) {
    fs.unlinkSync(`${projectsDirPath}/${res.project}.json`)
    console.log('')
    console.log(`Project ${res.project} was removed`)
    resolve({})
  })
}
