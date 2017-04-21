const getPhoenixData = require('../phoenixTunnel')

module.exports = function createNecessarySpaces(project) {
  console.log('Creating necessary spaces')

  return getNumberOfSpaces().then(numberOfSpaces => {
    console.log('Number of spaces', numberOfSpaces)
    return project
  })
}

function getNumberOfSpaces() {
  return getPhoenixData({
    message: 'SPACE',
    keystroke: 'g',
    parse: JSON.parse,
  })
}
