# Hyperspace

A JSON Config file to automatically change apps, directory and files from project to project for OSX.

### Install

```sh
npm i -g hyperspace-cli
```

### Commands

```sh
  Welcome to hyperspace 💫
  Travel fast through your galaxy of projects

  Usage: hyperspace <command> [options]

  Commands:

    remove [projectName]     Remove the project of your destination panel
    new [projectName]        Create new project from scratch
    edit [projectName]       Edit a project coordinators
    open [projectName]       Travel to your project
    save [projectName]       Save your current open files and apps

  Options:

    -h, --help  show help information
```

### JSON file

```
{
  "project": "Template Name",
  "description": "Description to help you find yourself",
  "windows": [
    {
      "app": "App Name",
      "files": [
        "~/list-of-files"
      ],
      "position": "left",
      "space": 1,
      "display": 1
    }
  ],
  "keepApps": [
    "List of apps you don't want to close where travel to the project"
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
