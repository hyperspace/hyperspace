const inquirer = require('inquirer')
const chalk = require('chalk')
const open = require('open')
const { projectsDirPath, getAllProjects } = require('../../lib/projects')

module.exports = {
  description: 'Edit a project coordinators',
  optionalArgs: 'projectName',
  handler(projectName) {
    if (projectName) {
      return editFile({ project: projectName })
    }

    const projects = getAllProjects().map(project =>
      project.replace('.json', '')
    )

    if (projects && projects.length > 0) {
      return askWhatProject()
    }

    return noProjects()
  },
}

function noProjects() {
  console.log(chalk.yellow('No projects to edit.'))
  return Promise.resolve()
}

function askWhatProject(projects) {
  return getListofProjects(projects).then(editFile)
}

function getListofProjects(projects) {
  console.log('') // Format
  return inquirer.prompt({
    type: 'list',
    name: 'project',
    message: chalk.bold('Edit your destinations'),
    choices: projects,
  })
}

function editFile(res) {
  return new Promise((resolve, reject) => {
    open(`${projectsDirPath}/${res.project}.json`, function(e) {
      if (e) {
        return reject(chalk.yellow(`No project named "${res.project}".`))
      }
      resolve()
    })
  })
}
