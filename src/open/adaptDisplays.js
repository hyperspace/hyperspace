const {getNumberOfDisplays} = require('../lib/displays')

module.exports = function adaptProjectToAvailableDisplays(project) {
  console.log('Adapting to available displays')

  return getNumberOfDisplays().then(numberOfDisplays => {
    return adaptWindows(project, numberOfDisplays)
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
