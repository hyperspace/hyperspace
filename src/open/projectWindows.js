const getHomePath = require('home-path')
const HOME = getHomePath()

module.exports = function processProjectWindows(project) {
  console.log('Processing project windows')

  const windowsFormatted = project.windows.reduce((filesToOpen, window) => {
    const windowFiles = getWindowFiles(window)
    return filesToOpen.concat(windowFiles)
  }, [])

  project.windowsFormatted = windowsFormatted

  return project
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
