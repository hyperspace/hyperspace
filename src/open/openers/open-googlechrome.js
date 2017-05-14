const open = require('open')
const exec = require('child_process').exec

module.exports = function defaultOpen(window) {
  let cmd

  if (window.appPath) {
    cmd = `open "${window.appPath}"`
  } else {
    cmd = `open -a "${window.name}"`
  }

  exec(cmd, function(error, stdout, stderr) {
    // command output is in stdout
  })

  if (!window.file) return

  let app = window.appPath ? window.appPath : window.name

  window.urls.forEach(function(url) {
    open(url, app, error => {
      if (error) {
        let msg = error.toString().split('\n')
        console.log(msg[1])

        return
      }
    })
  })
}
