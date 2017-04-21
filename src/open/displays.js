const getPhoenixData = require('../phoenixTunnel')

module.exports = function adaptProjectToAvailableDisplays(project) {
  console.log('Adapting to available displays')

  return getNumberOfDisplays().then(numberOfDisplays => {
    return adaptWindows(project, numberOfDisplays)
  })
}

function getNumberOfDisplays() {
  return getPhoenixData({
    message: 'DISPLAY',
    keystroke: 'd',
    parse: value => parseInt(value),
  })
}

function adaptWindows(project, numberOfDisplays) {
  const adaptedWindows = project.windows.map(window => {
    if (window.display > numberOfDisplays) {
      return Object.assign({}, window, {
        display: numberOfDisplays,
      })
    }
    return window
  })

  project.windows = adaptedWindows

  return project
}
