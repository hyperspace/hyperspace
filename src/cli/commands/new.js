const inquirer = require('inquirer')
const { createNewProject } = require('../../index')

module.exports = {
  description: 'Create new project from scratch',
  optionalArgs: 'projectName',
  handler(projectName) {
    if (projectName) {
      return createNewProject({ name: projectName })
    }

    return askProjectName()
  },
}

function askProjectName() {
  return getProjectDetails().then(createNewProject)
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


