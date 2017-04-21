const getPhoenixData = require('../phoenixTunnel')

module.exports = function adaptProjectToAvailableDisplays(project) {
  console.log('Adapting to available displays')

  return getNumberOfDisplays().then(numberOfDisplays => {
    console.log('Number of displays', numberOfDisplays)

    return project
  })
}

function getNumberOfDisplays() {
  return getPhoenixData({
    message: 'DISPLAY',
    keystroke: 'd',
    parse: value => parseInt(value),
  })
}
