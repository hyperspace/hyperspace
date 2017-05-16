const config = require('./config')
const current = require('./current')
const remove = require('./delete')
const newest = require('./new')
const edit = require('./edit')
const list = require('./list')
const open = require('./open')
const quit = require('./quit')
const save = require('./save')

module.exports = {
  config,
  current,
  remove,
  new: newest,
  edit,
  list,
  open,
  quit,
  save,
}
