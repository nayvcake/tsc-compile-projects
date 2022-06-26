const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const TSInterpreter = require('./interpreter')


const openTerminal = async (file, options, optionsProject) => {
  const {
    spawn,
    spawnSync
  } = require('child_process');
  const args = []
  if (typeof file != 'string') {
    throw Error('')
  } else {
    args.push('-p', file)
  }
  if (typeof options.watchMode === 'boolean') {
    if (options.watchMode) {
      args.push('-w')
    }
  }
  try {
    if (options.watchMode) {

      return new Promise(async resolve => {

        const terminal = await spawn('tsc', args, {
          shell: true,
          windowsHide: false,
          serialization: 'json'
        });
        resolve()
      })
    }
    if (optionsProject.lowCpuUsage) {
      return new Promise(async resolve => {
        const terminal = await spawn('tsc', args, {
          shell: true,
          windowsHide: true,
          serialization: 'json'
        });


        terminal.stdout.on('close', () => {
          resolve(null)
        })
      })
    }

  } catch (err) {
    throw err
  }
}


const fixDir = (str = '') => {
  if (str.startsWith('./')) {
    str = './' + str
  }
  return str
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

  if (typeof obj.name != 'string') {
    throw Error('TSC/JS - "-" The name must be a string input! [target]')
  }
  if (typeof obj.projectDir != 'string') {
    throw Error('TSC/JS - "-" The projectDir must be a string input! [target]')
  }
  if (typeof obj.watchMode != 'boolean') {
    obj.watchMode = false
  }
  return true
}


const checkProjectSettings = (obj) => {
  if (obj.command == null) {
    throw Error('TSC/JS - [0x0] You must have a command. Please check the field target! [target]')
  }
  if (obj.command == undefined) {
    throw Error('TSC/JS - [0x000] You must have a command. Please check the field target! [target]')
  }
  if (typeof obj.hotReload != 'boolean') {
    obj.hotReload = false
  }
  if (typeof obj.lowCpuUsage != 'boolean') {
    obj.lowCpuUsage = false
  }
  if (typeof obj.targets != 'object') {
    obj.targets = []
  } else {
    if (!Array.isArray(obj.targets)) {
      obj.targets = []
    }
  }
  return true
}


module.exports = class TSProjectWrapper extends EventEmitter {
  constructor() {
    super()
    this.projects = new Map()
  }


  async start(projects, options = {
    'hotReload': true,
    'command': "node .",
    'lowCpuUsage': true,
    'targets': []
  }) {
    if (Array.isArray(projects)) {
      this.emit('startingProject', projects)
      const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

      // Only projects that don't use watchMode
      for (const project of projects) {
        if (project.watchMode == false) {
          if (checkProject(project)) {
            const interpreter = TSInterpreter.createDefault()
            const terminal = await openTerminal(project.projectDir, project, options)
            const eventTerminal = EventEmitter
            this.emit('startingProject', terminal, this)
            this.projects.set(project.name, {
              terminal: terminal,
              events: eventTerminal
            })
            await wait(3 * 1000)

          } else {
            throw Error('There was a problem with the project!')
          }
        }
      }

      // Only projects that use watchMode
      for (const project of projects) {
        if (project.watchMode == true) {
          if (checkProject(project)) {

            const terminal = openTerminal(project.projectDir, project, options)
            const eventTerminal = EventEmitter
            this.emit('startingProject', terminal, this)
            this.projects.set(project.name, {
              terminal: terminal,
              events: eventTerminal
            })


          } else {
            throw Error('There was a problem with the project!')
          }
        }
      }
    } else {
      throw Error('TSC/JS - [x-x] Something went wrong when starting a project!')
    }
    return this
  }

  static async initializeDefault(settings = {
    'hotReload': false,
    'command': 'node .',
    'lowCpuUsage': true,
    'targets': []
  }) {
    let targets = {}
    let options = {
      'hotReload': true,
      'command': 'node .',
      'lowCpuUsage': true,
      'targets': []
    }

    try {
      const json = settings
      checkProjectSettings(json)

      targets = json.targets
      options = json
    } catch (err) {
      console.error(err)
      throw err
    }
    return new TSProjectWrapper().start(targets, options)
  }
}