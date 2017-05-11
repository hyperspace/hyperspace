const getHomePath = require('home-path')
const HOME = getHomePath()

module.exports = function processProjectWindows(project) {
  console.log('Processing project windows')

  const windowsFormatted = project.windows.reduce((filesToOpen, window) => {
    const windowFiles = window.files
      ? getWindowFiles(window)
      : buildFileObj(window)
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
  const obj = {
    name: window.app,
    pos: JSON.stringify(window.position),
    space: window.space,
    display: window.display,
  }

  // SHAME BRENO MADE ME DO THIS
  if (filePath) obj.file = replaceHomePath(filePath)
  if (window.urls) obj.urls = window.urls

  return obj
}

function replaceHomePath(filePath) {
  return filePath.replace(/^~/, HOME)
}
