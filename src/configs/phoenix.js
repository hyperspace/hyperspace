/* global Phoenix, App, Space, Key, sysWindows */
'use strict'

Phoenix.set({
  daemon: false,
  openAtLogin: true,
})

// full, top, bottom, left, right, top-right, top-left bottom-right, bottom-left
function screenPosition(window, sysPosition) {
  // Check what screen
  const windowRect = Screen.main().flippedFrame()

  if (sysPosition.indexOf('top') > -1) {
    windowRect.height = windowRect.height / 2
  }

  if (sysPosition.indexOf('bottom') > -1) {
    windowRect.y = windowRect.height / 2
    windowRect.height = windowRect.height / 2
  }

  if (sysPosition.indexOf('left') > -1) {
    windowRect.width = windowRect.width / 2
  }

  if (sysPosition.indexOf('right') > -1) {
    windowRect.x = windowRect.width / 2
    windowRect.width = windowRect.width / 2
  }

  window.setFrame(windowRect)
}

/* Checklog */
function isDone() {
  const sysWindows = Storage.get('sysWindows')

  const notDoneYet = sysWindows.filter(function(windowApp, index) {
    const key = `${windowApp.app}-${index}`
    const inPosition = Storage.get(key)

    return inPosition === false
  })

  var isDone = notDoneYet.length === 0

  if (isDone) broadcast('DONE', '')
}

/* Binds */
function onStoreWindows() {
  require('appTemp.js') // sysWindows come from here
  Phoenix.reload()

  Phoenix.log('storage')

  Storage.set('sysWindows', sysWindows)

  sysWindows.forEach(function(windowApp, index) {
    const key = `${windowApp.app}-${index}`
    Storage.set(key, false)
  })
}

Key.on('s', ['ctrl', 'shift'], onStoreWindows)

function broadcast(name, data) {
  Phoenix.log(`hyperspace-${name}||${JSON.stringify(data)}`)
}

function getNumberOfDisplays() {
  return Screen.all().length
}

function onGetNumberOfDisplays() {
  broadcast('DISPLAY', getNumberOfDisplays())
}

Key.on('d', ['ctrl', 'shift'], onGetNumberOfDisplays)

function onGetNumberOfSpacesPerDisplay() {
  const displays = Screen.all()

  const returnObj = displays.map(function(display) {
    let spaces = display.spaces()
    return spaces.length
  })

  broadcast('SPACE', returnObj)
}

Key.on('g', ['ctrl', 'shift'], onGetNumberOfSpacesPerDisplay)

/* Position */
function onPositionWindows() {
  var sysWindows = Storage.get('sysWindows')

  sysWindows.forEach(function(windowApp, index) {
    const key = `${windowApp.app}-${index}`
    const inPosition = Storage.get(key)

    if (inPosition) {
      return
    }

    Phoenix.log('Status ' + JSON.stringify(inPosition))
    const app = App.get(windowApp.app)

    if (app === undefined) return
    Phoenix.log(app.name())

    // To-do: Find the right window
    let targetWindow = app.mainWindow()
    if (targetWindow === undefined) return

    // To-do: Promise
    moveWindowToTargetSpace(targetWindow, windowApp, key)
  })

  isDone()
}

function moveWindowToTargetSpace(target, windowConfig, key) {
  const allSpaces = Space.all()
  const pos = windowConfig.position
  const spaceIndex = windowConfig.space

  var targetSpace = allSpaces[spaceIndex]
  var currentSpace = target.spaces()[0]

  currentSpace.removeWindows([target])
  targetSpace.addWindows([target])

  screenPosition(target, pos)

  Storage.set(key, true)
}

Key.on('p', ['ctrl', 'shift'], onPositionWindows)

/*
  Get Current ENV
*/
function cleanStorage() {
  App.all().forEach(function(app) {
    Storage.remove(`${app.name()}-register`)
  })
}

function registerApp(windowApp) {
  Storage.set(`${windowApp.app().name()}-register`, true)

  return {
    app: windowApp.app().name(),
    position: windowApp.frame(),
    space: getSpaceindex(windowApp.spaces()[0]),
    display: '2',
  }
}

function getDisplayIndex(currentDisplay) {
  const alldisplays = Screen.all()

  for (let i = 0; i <= alldisplays.length; i++) {
    if (alldisplays[i].isEqual(currentDisplay)) {
      return i
    }
  }
}

function getSpaceindex(currentSpace) {
  // Check if works in dual monitor
  const allSpaces = Space.all()

  for (let i = 0; i <= allSpaces.length; i++) {
    if (allSpaces[i].isEqual(currentSpace)) {
      return i
    }
  }
}

function createConfigObj() {
  let displays = Screen.all()
  let spaces = displays.map(function(d) {
    return d.spaces().length
  })

  return {
    displays: displays.length,
    spaces: spaces,
  }
}

function createWindowObj() {
  const windowsObj = []
  Phoenix.log(JSON.stringify(App.all()))
  App.all().forEach(function(app) {
    Phoenix.log(app.name())

    let isRegister = Storage.get(`${app.name()}-register`)
    if (isRegister) {
      Phoenix.log('Already')
      return
    }

    app.focus()

    let mainWindow = app.mainWindow()
    if (!mainWindow.isVisible()) return
    Phoenix.log(mainWindow.app().name())

    Phoenix.log('Register')

    let space = mainWindow.spaces()[0]
    space.windows().forEach(function(windowApp) {
      Phoenix.log(windowApp)
      let obj = registerApp(windowApp)
      Phoenix.log(obj)
      windowsObj.push(obj)
    })
  })

  Phoenix.log(JSON.stringify(windowsObj))

  return windowsObj
}

function getCurrentHyperSpace() {
  cleanStorage()

  broadcast('ENV', {
    config: createConfigObj(),
    windows: createWindowObj(),
  })
}

Key.on('a', ['ctrl', 'shift'], getCurrentHyperSpace)
