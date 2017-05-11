/* global Phoenix, App, Space, Key, sysWindows */
'use strict'

Phoenix.set({
  daemon: false,
  openAtLogin: true,
})

// full, top, bottom, left, right, top-right, top-left bottom-right, bottom-left
function stringPosition(window, sysPosition, display) {
  const screens = Screen.all()
  let goToScreen = screens[display - 1]

  if (goToScreen === undefined) goToScreen = Screen.main()

  const windowRect = goToScreen.flippedFrame()

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

function objPosition(window, sysPosition, display) {
  // TODO: avoid ghost window
  window.setFrame(sysPosition)
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
    const countKey = `${windowApp.app}-count`
    Storage.set(key, false)
    Storage.set(countKey, false)
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

    const countKey = `${windowApp.app}-count`
    let count = Storage.get(countKey) ? Storage.get(countKey) : 0

    if (inPosition) {
      return
    }

    Phoenix.log(windowApp.app)
    Phoenix.log('Status ' + JSON.stringify(inPosition))
    const app = App.get(windowApp.app)

    if (app === undefined) return

    Phoenix.log('Count:' + count)
    let targetWindow

    if (app.windows().length > 0) {
      targetWindow = app.windows()[count]
    } else {
      targetWindow = app.mainWindow()
    }

    if (targetWindow === undefined) return
    Storage.set(countKey, count + 1)

    // To-do: Promise
    moveWindowToTargetSpace(targetWindow, windowApp, key)
  })

  isDone()
}

function moveWindowToTargetSpace(target, windowConfig, key) {
  const allSpaces = Space.all()
  const pos = windowConfig.position
  const display = windowConfig.display
  const spaceIndex = windowConfig.space - 1

  var targetSpace = allSpaces[spaceIndex]
  var currentSpace = target.spaces()[0]

  currentSpace.removeWindows([target])
  targetSpace.addWindows([target])

  Phoenix.log(pos)
  Phoenix.log(typeof pos === 'object')
  if (typeof pos === 'object') {
    objPosition(target, pos, display)
  } else {
    stringPosition(target, pos, display)
  }

  Storage.set(key, true)
}

Key.on('p', ['ctrl', 'shift'], onPositionWindows)

/*
  Get Current ENV
*/

function registerApp(windowApp) {
  Phoenix.log(JSON.stringify(windowApp.spaces()[0]))
  Phoenix.log(getSpaceindex(windowApp.spaces()[0]))
  return {
    app: windowApp.app().name(),
    position: windowApp.frame(),
    space: getSpaceindex(windowApp.spaces()[0]),
    display: getDisplayIndex(windowApp.screen()),
  }
}

function getDisplayIndex(currentDisplay) {
  const alldisplays = Screen.all()

  for (let i = 0; i <= alldisplays.length; i++) {
    if (alldisplays[i].isEqual(currentDisplay)) {
      return i + 1
    }
  }
}

function getSpaceindex(currentSpace) {
  const allSpaces = Space.all()

  for (let i = 0; i <= allSpaces.length; i++) {
    if (allSpaces[i].isEqual(currentSpace)) {
      return i + 1
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

function getSpaceWindows() {
  const windowsObj = []
  let space = Screen.main().currentSpace()

  space.windows().forEach(function(windowApp) {
    let obj = registerApp(windowApp)
    Phoenix.log(JSON.stringify(obj))
    windowsObj.push(obj)
  })

  broadcast('ENV', windowsObj)
}

Key.on('a', ['ctrl', 'shift'], getSpaceWindows)
