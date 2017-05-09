const open = require('open')
const fs = require('fs')

module.exports = function pipeOpener(window) {
  let app = window.name.replace(/\s/g, '').toLowerCase()
  let openerPath = `${__dirname}/open-${app}.js`
  if (fs.existsSync(openerPath)) {
    const opener = require(openerPath)
    return opener(window)
  }

  return defaultOpen(window)
}

function defaultOpen(window) {
  open(window.file, window.name, error => {
    if (error) {
      let msg = error.toString().split('\n')
      console.log(msg[1])

      return
    }
  })
}
