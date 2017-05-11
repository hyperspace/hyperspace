const open = require('open')

module.exports = function defaultOpen(window) {
  window.urls.forEach(function(url) {
    open(url, window.name, error => {
      if (error) {
        let msg = error.toString().split('\n')
        console.log(msg[1])

        return
      }
    })
  })
}
