const inquirer = require('inquirer')
const chalk = require('chalk')
const open = require('../../open/index')
const spawn = require('child_process').spawn
const path = require('path')
const { projectsDirPath, getAllProjects } = require('../../index')

module.exports = {
  description: 'Travel to your project',
  optionalArgs: 'projectName',
  handler(projectName) {
    if (projectName) {
      if (projectName.split('.').pop() === 'json') {
        return openProject(projectName)
      }

      return openProject({ project: projectName })
    }

    return askWhatProject()
  },
}

function askWhatProject() {
  return getListofProjects().then(openProject)
}

function getListofProjects() {
  console.log('') // Format
  return inquirer.prompt({
    type: 'list',
    name: 'project',
    message: chalk.bold('Choose your next destination 💫:'),
    choices: getAllProjects().map(project => project.replace('.json', '')),
  })
}

function openProject(res) {
  return new Promise(function(resolve, reject) {
    let filePath = `${projectsDirPath}/${res.project}.json`
    if (typeof res != 'object') {
      filePath = res
    }

    let project = require(filePath)

    const setupPath = path.dirname(require.main.filename).replace('/cli', '')
    const exec = spawn(`${setupPath}/configs/setup.sh`)

    exec.stdout.on('data', function(data) {
      console.log(data.toString())
    })

    exec.on('exit', function() {
      open(project)
    })
  })
}
