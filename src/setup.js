const open = require('open')
const getHomePath = require('home-path')
const HOME = getHomePath()

module.exports = function setup(project) {
  if (!project) {
    project = require('./mocks/project-template.json')
  }

  const toOpen = getProjectWindowsFiles(project)

  toOpen.map(openFile)
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

function getProjectWindowsFiles(project) {
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
