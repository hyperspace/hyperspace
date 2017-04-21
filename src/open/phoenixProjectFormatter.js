const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const getHomePath = require('home-path')
const HOME = getHomePath()

const templatePath = path.join(__dirname, 'appTemp.js.template')
const appTempPath = path.join(HOME, '.config', 'phoenix', 'appTemp.js')

module.exports = function writePhoenixProjectFile(project) {
  console.log('Writing Phoenix file')

  const fileContent = renderAppTempTemplate({
    windows: project.windowsFormatted,
  })
  fs.writeFileSync(appTempPath, fileContent)
}

function renderAppTempTemplate(data) {
  const templateContent = fs.readFileSync(templatePath, 'utf8')
  const render = _.template(templateContent)

  return render(data)
}
