#! /usr/bin/env node

const { help, find, run } = require('findhelp')
const minimist = require('minimist')
const pkg = require('../../package.json')
const chalk = require('chalk')
const commands = require('./commands')

let tree = Object.assign({}, commands, {
  options: [
    {
      short: 'h',
      long: 'help',
      description: 'show help information',
      type: 'boolean',
    },
  ],
})

tree.handler = function rootHandler(options) {
  if (options.h || options.help) {
    console.log(help(tree, pkg))
  } else if (options.v || options.version) {
    console.log(pkg.version)
  } else {
    console.log(`  ${greeting().join('\n  ')}`)
    console.log(help(tree, pkg))
  }
  return Promise.resolve()
}

function greeting() {
  return [`Welcome to ${chalk.blue('hyperspace')}`]
}

const checkCommandExists = found =>
  !found.command ? Promise.reject({ name: 'CommandNotFound' }) : found

Promise.resolve(find(tree, process.argv.slice(2), minimist))
  .then(checkCommandExists)
  .then(command => {
    const maybePromise = run(command)
    if (!maybePromise || !maybePromise.then) {
      console.warn('Command handlers should return a Promise.')
    }
    return maybePromise
  })
  .catch(console.log.bind(console))
