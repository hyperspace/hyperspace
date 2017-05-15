const path = require('path')
const getHomePath = require('home-path')
const HOME = getHomePath()
const fs = require('fs')
const exec = require('child_process').exec

const projectsDirPath = path.join(HOME, '.config', 'hyperspace')

function getAllProjects() {
  if (!fs.existsSync(projectsDirPath)) return []
  return fs
    .readdirSync(projectsDirPath)
    .filter(file => file.indexOf('.DS_Store') === -1)
    .filter(file => file.indexOf('configs.json') === -1)
}

module.exports = {
  projectsDirPath,
  getAllProjects,
}
