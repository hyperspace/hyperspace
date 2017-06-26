const getHomePath = require('home-path')
const appleScripts = require('../lib/appleScripts')
const HOME = getHomePath()

module.exports = function closeApps(project) {
  console.log('Closing apps')
  let whiteList = getWhiteList(project)

  return new Promise(resolve => {
    appleScripts.closeApps({ whiteList }, function(err) {
      if (err) {
        console.error(err)
        return
      }

      setTimeout(() => resolve(project), 200)
    })
  })
}

function getWhiteList(project) {
  let whiteList = ''
  const configs = require(`${HOME}/.config/hyperspace/configs.json`)

  if (configs.keepApps) whiteList = `"${configs.keepApps.join('","')}"`
  if (project.keepApps) whiteList = `"${project.keepApps.join('","')}"`

  return whiteList
}
