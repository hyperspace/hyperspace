jest.mock('home-path')
jest.mock('fs')
jest.mock('open')
jest.mock('./appleScripts')

const {
  projectsDirPath,
  getAllProjects,
  writeProjectFile,
  createNewProject,
} = require('./projects')

describe('Projects Lib', () => {
  it('should return the projects dir path', () => {
    expect(projectsDirPath).toBe('HOME/.config/hyperspace')
  })

  describe('getAllProjects()', () => {
    it("should return empty array if projects dir path doesn't exists", () => {
      const projects = getAllProjects()

      expect(projects).toHaveLength(0)
    })

    it('should return empty array if has only .DS_Store or configs.json', () => {
      const MOCK_FILE_INFO = {
        'HOME/.config/hyperspace/.DS_Store': '',
        'HOME/.config/hyperspace/configs.json': '{}',
      }
      require('fs').__setMockFiles(MOCK_FILE_INFO)

      const projects = getAllProjects()

      expect(projects).toHaveLength(0)
    })

    it('should return an array of existing projects filenames', () => {
      const MOCK_FILE_INFO = {
        'HOME/.config/hyperspace/project-1.json': '{}',
        'HOME/.config/hyperspace/project-2.json': '{}',
      }

      require('fs').__setMockFiles(MOCK_FILE_INFO)
      const projects = getAllProjects()

      expect(projects).toMatchObject(['project-1.json', 'project-2.json'])
    })
  })

  describe('writeProjectFile()', () => {
    const constantDate = new Date('2017-06-13T04:41:20')

    // eslint-disable-next-line
    Date = class extends Date {
      constructor() {
        super()
        return constantDate
      }
    }

    it('should return a function', () => {
      const result = writeProjectFile('foo', 'bar')

      expect(typeof result).toBe('function')
    })

    it('the function should return the project path', () => {
      const name = 'foo'
      const description = 'bar'
      const fn = writeProjectFile(name, description)

      const result = fn({})

      expect(result).toBe(`HOME/.config/hyperspace/${name}.json`)
    })

    it("should create a project name if it doesn't exists", () => {
      const name = null
      const description = 'bar'
      const fn = writeProjectFile(name, description)

      const result = fn({})

      expect(result).toBe('HOME/.config/hyperspace/2017-6-13-project.json')
    })

    it('should create a non conflicting name for the project', () => {
      const MOCK_FILE_INFO = {
        'HOME/.config/hyperspace/2017-6-13-project.json': '{}',
      }

      require('fs').__setMockFiles(MOCK_FILE_INFO)

      const name = null
      const description = 'bar'
      const fn = writeProjectFile(name, description)

      const result = fn({})

      expect(result).toBe('HOME/.config/hyperspace/2017-6-13-project-1.json')
    })

    it('should write project file json', () => {
      const fs = require('fs')
      const name = 'foo'
      const description = 'bar'
      const fn = writeProjectFile(name, description)
      const project = fn({ otherProp: true })

      const result = JSON.parse(fs.readFileSync(project))

      expect(result).toBeDefined()
      expect(result.project).toBe(name)
      expect(result.description).toBe(description)
      expect(result.otherProp).toBe(true)
    })

    it('should call quitPhoenix()', () => {
      const appleScripts = require('./appleScripts')

      writeProjectFile('foo', 'bar')({})

      expect(appleScripts.quitPhoenix).toHaveBeenCalled()
    })
  })

  describe('createNewProject()', () => {
    it('should write a project', () => {
      const fs = require('fs')
      const name = 'foo'
      const description = 'bar'

      expect.assertions(1)

      return createNewProject({ name, description }).then(() => {
        const projectPath = `${projectsDirPath}/${name}.json`
        const content = fs.readFileSync(projectPath)

        expect(content).toBeDefined()
      })
    })

    it('should call open with file path', () => {
      const open = require('open')
      const name = 'foo'
      const description = 'bar'

      open.mockClear()
      expect.assertions(1)

      return createNewProject({ name, description }).then(() => {
        const projectPath = `${projectsDirPath}/${name}.json`

        expect(open).toHaveBeenLastCalledWith(projectPath)
      })
    })
  })
})
