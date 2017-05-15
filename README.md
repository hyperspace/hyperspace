# Hyperspace

A JSON Config file to automatically change apps, directory and files from project to project for OSX.

### Install

```sh
npm i -g hyperspace-cli
```

### Commands

```sh
Usage: hyperspace-cli <command> [options]

Commands:

  deleteCommand [projectName]Delete a project
  edit [projectName]       Edit a project
  open [projectName]       Open a project
  save [projectName]       Save a project

Options:

  -h, --help  show help information
```

### JSON file

```
{
  "project": "HyperSpace",
  "description": "Open projects",
  "windows": [
    {
      "app": "App Name",
      "files": [
        "~/file"
      ],
      "position": "left",
      "space": 5,
      "display": 2
    }
  ],
  "keepApps": [
    "Slack"
  ]
}
```

### Roadmap v0.8

- [x] Open apps and files
- [x] Position apps in the OSX desktop
- [x] Verify if the number of display exist
- [x] Verify if the number of OSX spaces exist
- [x] Generate JSON config from current OSX state
- [x] Close all apps
- [x] Discover app open files
- [x] Get the open files path
- [x] Open Browser URLs
- [x] Generate unique project file
- [x] CLI
- [ ] Test in other macOS configurations

### Roadmap v1.0

- [ ] Create API to openers and saves
- [ ] Open Terminal and execute script
- [ ] Create global configs
- [ ] Fix bugs
- [ ] Electron UI
- [ ] Landing page

### Brainstorming

- [ ] App Name dictionary
- [ ] Clear the desktop saving in a _tempfile
- [ ] Inject the project files
- [ ] Storage everthing in the cloud
