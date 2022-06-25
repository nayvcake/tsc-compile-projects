const fs = require('fs')
const path = require('path')
const {
  spawn
} = require('child_process')
const EventEmitter = require('events')
const openDir = async (dir) => {
  let files = []
  await fs.readdirSync(dir).map((a, b, c) => {
    files = c
  })
  return files
}

const openFile = async (fileDir) => {
  let files = null
  await fs.readFileSync(dir).map((a) => {
    files = a
  })
  return files
}


const verify = async (file) => {
  const isJsonAndFile = false
  try {
    JSON.parse(await openFile(file))
    isJsonAndFile = true
  } catch (_) {}
  return isJsonAndFile
}


const openTerminal = async (file, out) => {
  const a = []
  const b = []
  const terminal = spawn('tsc', [`-p ${path.resolve('file')}`])
  return terminal
}


const checkProject = (obj) => {
  if (obj.name == null) {
    throw Error('TSC/JS - [0x0] You must have a project name. Please check the field target! [target]')
  }
  if (obj.name == undefined) {
    throw Error('TSC/JS - [0x000] You must have a project name. Please check the field target! [target]')
  }
  if (obj.projectDir == null) {
    throw Error("TSC/JS - [0x001] It is necessary to inform the project's tsconfig.json settings. [target]")
  }
  if (obj.projectDir == undefined) {
    throw Error("TSC/JS - [0x001] It is necessary to inform the project's tsconfig.json settings. [target]")
  }

  if (typeof obj.name !== 'string') {
    throw Error('TSC/JS - "-" The name must be a string input! [target]')
  }
  if (typeof obj.projectDir !== 'string') {
    throw Error('TSC/JS - "-" The projectDir must be a string input! [target]')
  }
  return true
}


module.exports = class ProjectWrapper extends EventEmitter {
  constructor() {
    super()
    this.projects = new Map()
  }


  async start(dir, projects) {
    if (Array.isArray(projects)) {
      this.emit('startingProject', projects)
      for (const project of projects) {
        if (checkProject(project)) {
          const terminal = openTerminal(path.resolve('') + dir)
          const eventTerminal = EventEmitter
          this.emit('startingProject', terminal, this)
          this.projects.set(project.name, {
            terminal: terminal,
            events: eventTerminal
          })


          this.on('')
        } else {
          throw Error('There was a problem with the project!')
        }
      }
    } else {
      throw Error('TSC/JS - [x-x] Something went wrong when starting a project!')
    }
    return this
  }

  static async initialize(options = {
    mode: 'hotreload'
  }) {
    const searchProjectSettings = await openDir(path.resolve(''))
    for (const file of searchProjectSettings) {
      if (file.endsWith('.json')) {
        if (file === 'projects.json') {
          if (verify(path.resolve('') + file)) {

            break
          } else {
            throw Error('TSC/JS - [-.-] Could not read project settings.')
          }
        }
      }
    }
    return new ProjectWrapper().start()
  }
}