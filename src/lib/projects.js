const path = require('path')
const getHomePath = require('home-path')
const HOME = getHomePath()
const fs = require('fs')

const projectsDirPath = path.join(HOME, '.config', 'hyperspace')

function getAllProjects() {
  return fs
    .readdirSync(projectsDirPath)
    .filter(file => file.indexOf('.DS_Store') === -1)
}

module.exports = {
  projectsDirPath,
  getAllProjects,
}
