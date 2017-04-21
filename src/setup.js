const open = require('open')
const getHomePath = require('home-path')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const HOME = getHomePath()

module.exports = function setup(project) {
  const windows = getProjectWindows(project)

  windows.map(openFile)
  writePhoenixObject(windows)
}

function openFile(window) {
  open(window.file, window.name, error => {
    if (error) {
      let msg = error.toString().split('\n')
      console.log(msg[1])

      return
    }
  })
}

function getProjectWindows(project) {
  return project.windows.reduce((filesToOpen, window) => {
    const windowFiles = getWindowFiles(window)
    return filesToOpen.concat(windowFiles)
  }, [])
}

function getWindowFiles(window) {
  return window.files.reduce((itemFiles, filePath) => {
    const fileObj = buildFileObj(window, filePath)
    return itemFiles.concat(fileObj)
  }, [])
}

function buildFileObj(window, filePath) {
  return {
    file: replaceHomePath(filePath),
    name: window.app,
    pos: window.position,
    space: window.space,
    display: window.display,
  }
}

function replaceHomePath(filePath) {
  return filePath.replace(/^~/, HOME)
}

const templatePath = path.join(__dirname, 'template', 'appTemp.js.template')
const appTempPath = path.join(HOME, '.config', 'phoenix', 'appTemp.js')

function writePhoenixObject(windows) {
  const fileContent = renderAppTempTemplate({windows})
  fs.writeFileSync(appTempPath, fileContent)
}

function renderAppTempTemplate(data) {
  const templateContent = fs.readFileSync(templatePath, 'utf8')
  const render = _.template(templateContent)

  return render(data)
}
