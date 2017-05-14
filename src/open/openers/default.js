const open = require('open')
const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')

module.exports = function pipeOpener(window) {
  const app = window.name.replace(/\s/g, '').toLowerCase()
  const openerPath = path.join(__dirname, `open-${app}.js`)

  if (fs.existsSync(openerPath)) {
    const opener = require(openerPath)
    return opener(window)
  }

  if (window.file) {
    return fileOpen(window)
  }

  return defaultOpen(window)
}

function fileOpen(window) {
  let app = window.appPath ? window.appPath : window.name
  open(window.file, window.name, error => {
    if (error) {
      let msg = error.toString().split('\n')
      console.log(msg[1])

      return
    }
  })
}

function defaultOpen(window) {
  let cmd

  if (window.appPath) {
    cmd = `open "${window.appPath}"`
  } else {
    cmd = `open -a "${window.name}"`
  }

  exec(cmd, function(error, stdout, stderr) {
    // command output is in stdout
  })

  return
}
