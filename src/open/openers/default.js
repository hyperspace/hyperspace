const open = require('open')

module.exports = function openFile(window) {
  open(window.file, window.name, error => {
    if (error) {
      let msg = error.toString().split('\n')
      console.log(msg[1])

      return
    }
  })
}
