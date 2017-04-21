const watch = require('node-watch')
const path = require('path')
var fs = require('fs')

const phoenixScriptPath = path.join(__dirname, 'src', 'configs', 'phoenix.js')

const HOME = process.env.HOME
const destPhoenixPath = path.join(HOME, '.config', 'phoenix', 'phoenix.js')

function errorLog(err) {
  console.error('Error while copying Phoenix script', err)
}

function doneLog() {
  console.log('Done')
}

console.log('Watching for Phoenix script changes...')
watch(phoenixScriptPath, { recursive: true }, function() {
  console.log('Phoenix script changed. Copying it to the right directory...')

  const rd = fs.createReadStream(phoenixScriptPath)
  const wr = fs.createWriteStream(destPhoenixPath)

  rd.on('error', errorLog)
  wr.on('error', errorLog)
  wr.on('close', doneLog)

  rd.pipe(wr)
})
