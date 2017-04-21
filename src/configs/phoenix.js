/* global Phoenix, App, Space, Key */
"use strict";

Phoenix.set({
  daemon: true,
  openAtLogin: true
});

// full, top, bottom, left, right, top-right, top-left bottom-right, bottom-left
function screenPosition(window, sysPosition) {
  // Check what screen
  const windowRect = Screen.main().flippedFrame();

  if (sysPosition.indexOf("top") > -1) {
    windowRect.height = windowRect.height / 2;
  }

  if (sysPosition.indexOf("bottom") > -1) {
    windowRect.y = windowRect.height / 2;
    windowRect.height = windowRect.height / 2;
  }

  if (sysPosition.indexOf("left") > -1) {
    windowRect.width = windowRect.width / 2;
  }

  if (sysPosition.indexOf("right") > -1) {
    windowRect.x = windowRect.width / 2;
    windowRect.width = windowRect.width / 2;
  }

  window.setFrame(windowRect);
}

/* Checklog */
function isDone() {
  const sysWindows = Storage.get("sysWindows");
  const allinPosition = [];

  sysWindows.forEach(function(windowApp, index) {
    const key = `${windowApp.app}-${index}`;
    const inPosition = Storage.get(key);

    allinPosition.push(inPosition);
  });

  var isDone = allinPosition.every(elem => elem === true);

  if (isDone) Phoenix.log("hyperspace-DONE");
}

function getCurrentHyperSpace() {
  let displays = Screen.all();
  let spaces = displays.map(function(d) {
    return d.spaces();
  });

  const config = {
    displays: displays.length,
    spaces: spaces
  };

  const windowsObj = [];
  displays.map(function(d) {
    d.windows().forEach(function(windowApp, index) {
      windowsObj.push({
        app: windowApp.app().name(),
        position: windowApp.frame(),
        space: windowApp.spaces(),
        display: windowApp.screen()
      });
    });
  });

  Phoenix.log(
    "hyperspace-ENV:" +
      JSON.stringify({
        config: config,
        windows: windowsObj
      })
  );
}

/* Spaces */
function moveWindowToTargetSpace(target, windowConfig, key) {
  const allSpaces = Space.all();
  const pos = windowConfig.position;
  const spaceIndex = windowConfig.space;

  var targetSpace = allSpaces[spaceIndex];
  var currentSpace = target.spaces()[0];

  currentSpace.removeWindows([target]);
  targetSpace.addWindows([target]);

  screenPosition(target, pos);

  Storage.set(key, true);
}

/* Binds */
Key.on("s", ["ctrl", "shift"], function() {
  require("appTemp.js");
  Phoenix.reload();

  Phoenix.log("storage");

  Storage.set("sysWindows", sysWindows);

  sysWindows.forEach(function(windowApp, index) {
    // var obj = Object.assign(windowApp, { open: false })
    const key = `${windowApp.app}-${index}`;
    Storage.set(key, false);
  }, this);
});

Key.on("d", ["ctrl", "shift"], function() {
  var display = Screen.all();
  Phoenix.log("hyperspace-DISPLAY:" + display.length);
});

Key.on("g", ["ctrl", "shift"], function() {
  var displays = Screen.all();
  var returnObj = [];
  displays.forEach(function(dply) {
    var spaces = dply.spaces();
    returnObj.push(spaces.length);
  }, this);

  Phoenix.log("hyperspace-SPACE:" + JSON.stringify(returnObj));
});

/* Position */
Key.on("p", ["ctrl", "shift"], function() {
  var sysWindows = Storage.get("sysWindows");

  sysWindows.forEach(function(windowApp, index) {
    const key = `${windowApp.app}-${index}`;
    const inPosition = Storage.get(key);

    if (inPosition) {
      return;
    }

    Phoenix.log("Status " + JSON.stringify(inPosition));
    const app = App.get(windowApp.app);
    Phoenix.log(app.name());

    if (app === undefined) return;

    // To-do: Find the right window
    let targetWindow = app.mainWindow();

    if (targetWindow === undefined) return;

    // To-do: Promisse
    moveWindowToTargetSpace(targetWindow, windowApp, key);
  }, this);

  isDone();
});

Key.on("a", ["ctrl", "shift"], function() {
  getCurrentHyperSpace();
});
