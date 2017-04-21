const {getPhoenixData} = require('./phoenixTunnel.js')
const getHomePath = require('home-path')
const path = require('path')
const fs = require('fs')
const HOME = getHomePath()

/* module.exports =*/
async function save() {
  const projectFilePath = path.join(
    HOME,
    '.config',
    'hyperspace',
    'project-template.js',
  )

  try {
    const data = await getPhoenixData({
      message: 'ENV',
      keystroke: 'a',
      parse: value => value,
    })

    fs.writeFileSync(projectFilePath, data)
    // console.log(JSON.parse(data))
    // console.log(JSON.parse(data))
  } catch (error) {
    console.error(error)
  }
}

save()
// get the json
// save in hyperspace folder
// use template hehe
