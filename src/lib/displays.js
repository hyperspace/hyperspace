const {getPhoenixData} = require('../phoenixTunnel')

function getNumberOfDisplays() {
  return getPhoenixData({
    message: 'DISPLAY',
    keystroke: 'd',
    parse: value => parseInt(value),
  })
}

module.exports = {
  getNumberOfDisplays,
}
