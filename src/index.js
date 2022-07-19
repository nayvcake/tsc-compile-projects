const EventEmitter = require('events')
const {
  TSInterpreter,
  IdentifyInterpreter,
  MetadataInterPreter
} = require('./interpreter')
const {
  HotReloadUtils
} = require('./hotreload')
const {
  CommandUtils
} = require('./commands')
const {
  Event
} = require('./events')
const Logging = require('./logging')


const openTerminal = async (file, options, optionsProject, interpreter, projectName, projectWrapper) => {
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
        let skip = -1
        let resolved = false
        terminal.stdout.on('data', async (data) => {
          skip++;

          if (skip == 0) return;
          let message = ''

          if (data instanceof Buffer) {
            message = data.toString('utf-8')
          } else if (data instanceof String) {
            message = data
          } else {
            throw Error('Strange encoding. Check the log entries.')
          }

          Logging.emitLog(projectWrapper, {
            logging: 'typescript',
            data: {
              message: message,
              projectName: projectName
            }
          })

          const event = TSInterpreter.validateEvent(data)
          const a = TSInterpreter.createIdentifyInterpreter({
            projectName: projectName,
            /**
             * @description There are several events to identify and resolve function
             */
            eventType: event.eventName,
            /**
             * @description Reminder metadata for things important to development.

             */
            metadata: {
              a: data,
            },
            /**
             * @description Error enlisting occurred in Typescript
             * 
             */
            errors: [],
            /**
             * @description Maybe someday you 'll have use for it...
             */
            payload: {
              project: optionsProject
            },
            /**
             * @description This identifier used in which events... ?
             */
            label: [],
            /**
             * @description Identified has already been named in such events.
             */
            tags: [],
            /**
             * @description Small graph for CPU spike register that was created during the execution of the Typescript command.
             */
            cpuUsage: [],
            /**
             * @description Small graph for MEMORY spike register that was created during the execution of the Typescript command.
             */
            memoryUsage: [],
            /**
             * @description Application was forced to restart due to excessive updates which can cause absurd changes and higher CPU spike.
             */
            forceRestart: false,
            /**
             * @description Estimated time marker for identification execution.
             */
            time: 0
          })
          interpreter.eventOn(a.parse(), this, a)
          if (a.parse().eventName === Event.EVENT_FIND_COUNT_OF_ERROR) {
            if (resolved == false) {
              resolved = !resolved
              resolve(null)
            }
          }
        })
      })
    }
    if (optionsProject.lowCpuUsage) {
      return new Promise(async resolve => {
        const terminal = await spawn('tsc', args, {
          shell: true,
          windowsHide: true,
          serialization: 'json'
        });
        let skip = -1
        let resolved = false
        terminal.stdout.on('data', async (data) => {
          skip++;
          if (skip == 0) return;
          let message = ''

          if (data instanceof Buffer) {
            message = data.toString('utf-8')
          } else if (data instanceof String) {
            message = data
          } else {
            throw Error('Strange encoding. Check the log entries.')
          }


          Logging.emitLog(projectWrapper, {
            logging: 'typescript',
            data: {
              message: message,
              projectName: projectName
            }
          })

          const event = TSInterpreter.validateEvent(data)
          const a = TSInterpreter.createIdentifyInterpreter({
            projectName: projectName,
            /**
             * @description There are several events to identify and resolve function
             */
            eventType: event.eventName,
            /**
             * @description Reminder metadata for things important to development.

             */
            metadata: {
              a: data,
            },
            /**
             * @description Error enlisting occurred in Typescript
             * 
             */
            errors: [],
            /**
             * @description Maybe someday you 'll have use for it...
             */
            payload: {
              project: optionsProject,

            },
            /**
             * @description This identifier used in which events... ?
             */
            label: [],
            /**
             * @description Identified has already been named in such events.
             */
            tags: [],
            /**
             * @description Small graph for CPU spike register that was created during the execution of the Typescript command.
             */
            cpuUsage: [],
            /**
             * @description Small graph for MEMORY spike register that was created during the execution of the Typescript command.
             */
            memoryUsage: [],
            /**
             * @description Application was forced to restart due to excessive updates which can cause absurd changes and higher CPU spike.
             */
            forceRestart: false,
            /**
             * @description Estimated time marker for identification execution.
             */
            time: 0
          })


          interpreter.eventOn(a.parse(), this, a)
          if (a.parse().eventName === Event.EVENT_FIND_COUNT_OF_ERROR) {
            if (resolved == false) {
              resolved = !resolved
              resolve(null)
            }
          }
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
    throw Error('TSC/JS - [0x0] You must have a command. Please check the field target! [command]')
  }
  if (!Array.isArray(obj.command) || typeof obj.command == 'string') {
    throw Error('TSC/JS - [0x000] You must have a command. Please check the field target! [command]')
  } else {
    if (Array.isArray(obj.command)) {
      let objPosition = -1

      for (const cmd of obj.command) {
        objPosition++
        if (!Array.isArray(cmd) && typeof cmd !== 'string') {
          throw Error(`TSC/JS - [0x120] You must have a command::[(${objPosition}).'${cmd}']. Please check the field! [command]`)
        } else {
          if (typeof cmd[objPosition][0] !== 'string') {
            throw Error(`TSC/JS - [0x1223] You must have a command::[(${objPosition}).'${cmd}']. Please check the field! [command]`)
          }
        }
      }
    }
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
    this.interpreter = TSInterpreter.createDefault()
    this.projects = new Map()
    this.hotReloadManager = new HotReloadUtils.HotReloadResource(this)
    this.commandManager = new CommandUtils.CommandManagerTerminal(this)

    this.interpreter.on('debugData', ({
      eventName,
      IdentifyInterpreter
    }) => {
      switch (eventName) {
        case Event.EVENT_FIND_COUNT_OF_ERROR: {
          this.commandManager.emit('alertOfRestart', IdentifyInterpreter)
        }
        break
      }
    })
  }
  /**
   * @description This is very important to start a project. In this case, it will check events of these projects.
   * @returns TSProjectWrapper
   */
  startWatchEvents() {

    return this;
  }

  async start(projects, options = {
    'hotReload': true,
    'command': "node .",
    'lowCpuUsage': true,
    'targets': []
  }) {
    let ready = false
    if (Array.isArray(projects)) {
      this.emit('startingProject', projects)
      const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

      // Only projects that don't use watchMode
      for (const project of projects) {
        if (project.watchMode == false) {
          if (checkProject(project)) {
            const terminal = openTerminal(project.projectDir, project, options, this.interpreter, project.name, this)
            const eventTerminal = EventEmitter
            this.emit('startingProject', terminal, this)
            this.projects.set(project.name, {
              terminal: terminal,
              events: eventTerminal,
              interpreter: this.interpreter
            })
            await wait(3 * 1000)

          } else {
            throw Error('There was a problem with the project!')
          }
        }
      }


      this.emit('endCompile', true)

      // Only projects that use watchMode
      for (const project of projects) {
        if (project.watchMode == true) {
          if (checkProject(project)) {

            const terminal = await openTerminal(project.projectDir, project, options, this.interpreter, project.name, this)
            const eventTerminal = EventEmitter
            this.emit('startingProject', terminal, this)
            this.projects.set(project.name, {
              terminal: terminal,
              events: eventTerminal,
              interpreter: this.interpreter
            })

            this.interpreter.on('debugData', (data) => {
              this.emit('debugInterpreter', {
                eventName: 'debugInterpreter',
                d: data
              })
              if (ready == true) {
                if (data.eventName === Event.EVENT_FIND_COUNT_OF_ERROR) {
                  this.hotReloadManager.addRestart(data.identifyInterpreter)
                }
              }

            })
          } else {
            throw Error('There was a problem with the project!')
          }
        }
      }

      this.emit('runCommands', true)

      if (Array.isArray(options.command)) {
        for (const cmd of options.command) {
          if (Array.isArray(cmd)) {
            const command = cmd[0] !== null ? cmd[0] : ''
            const optionsShell = cmd[1] !== null ? cmd[1] : {}
            const instance = CommandUtils.CommandManagerTerminal.createCommandBlock(this, command, optionsShell)

            this.hotReloadManager.createBucketWithoutInterpreter(instance)
            this.commandManager.registerBlock(instance)
          }
        }
      } else {
        if (typeof options.command == 'object') {
          const command = options.command.run === null ? options.command.run : ''
          const optionsShell = options.command.options === null ? options.command.options : {}
          const instance = CommandUtils.CommandManagerTerminal.createCommandBlock(this, command, optionsShell)

          this.hotReloadManager.createBucketWithoutInterpreter(instance)
          this.commandManager.registerBlock(instance)
        } else if (typeof options.command === 'string') {
          const command = options.command
          const instance = CommandUtils.CommandManagerTerminal.createCommandBlock(this, command, {})

          this.hotReloadManager.createBucketWithoutInterpreter(instance)
          this.commandManager.registerBlock(instance)
        }
      }
    } else {
      throw Error('TSC/JS - [x-x] Something went wrong when starting a project!')
    }
    ready = true
    return this
  }

  static initializeDefault(settings = {
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
      throw err
    }
    return new TSProjectWrapper().start(targets, options)
  }
}
