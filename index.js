import configs from './src/vtex-audit.json'
import open from 'open'
import _ from 'lodash'

const openFiles = (file, name) => {

    let t = open(file, name, (error) => {
        if (error) {
            let msg = error.toString().split('\n')
            console.log(msg[1])
        }
    })

}

const windows = configs.windows

_.forEach(windows, (app, name) => {

    _.forEach(app.files, (file) => {
        setTimeout(() => {
            openFiles(file,name)
        }, 100)
    })

})
