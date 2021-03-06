const EventEmitter = require('events');
const Logging = require('./logging');

class CommandBlock extends EventEmitter {
  constructor(projectWrapper) {
    super();
    this._id = Math.random(Math.floor() * 100999999)
    this.commandRunning = null
    this.command = ''
    this.options = {}
    this.started = Date.now()
    this.restarted = 0
    this.projectWrapper = projectWrapper
  }


  create(command = '', options = {}) {
    const {
      spawn
    } = require('child_process');
    if (this.command == '') {
      this.command = command
      this.options = options
    }
    this.commandRunning = spawn(command, options)
    this.commandRunning.stdout.on('data', async (data) => {
      let message = ''

      if (data instanceof Buffer) {
        message = data.toString('utf-8')
        this.emit('log', data.toString('utf-8'))
      } else if (data instanceof String) {
        message = data
        this.emit('log', data)
      } else {
        try {
          this.emit('log', JSON.parse(data))
        } catch (_) {}
      }

      Logging.emitLog(this.projectWrapper, {
        logging: 'javascript',
        data: {
          message: message,
          commandBlock: this
        }
      })
    })
    this.command = command
    this.started = Date.now()
    this.restarted = 0
    this.emit('create', true)
  }


  async restart() {
    if (this.commandRunning !== null) {
      await this.commandRunning.kill(2)
    }
    this
      .watchOn()
      .create(this.command, this.options)
  }


  async destroy() {
    if (this.commandRunning !== null) {

      this.emit('destroy', this.commandRunning, this)
      await this.commandRunning.kill(2)
    }
  }

  watchOn() {
    this.on('kill', () => this.commandRunning.kill(-1))
    this.once('create', () => {
      this.commandRunning.on('exit', args => {
        this.commandRunning = null
        this.emit('exit', true, this, args)
      })
      this.commandRunning.on('disconnect', () => {
        this.commandRunning = null
        this.emit('disconnect', true, this)
      })
      this.commandRunning.on('error', (err) => {
        this.emit('error', err, this)
      })
    })
    return this
  }
}

class CommandManagerTerminal extends EventEmitter {
  constructor(projectWrapper) {
    super();
    this.commands = []
    this.projectWrapper = projectWrapper
  }

  searchInstance(instance) {
    let result = null
    if (instance instanceof CommandBlock) {
      for (const a of this.commands) {
        if (a instanceof CommandBlock) {
          if (a._id == instance._id) {
            result = a
            break
          }
        }
      }
    }
    return result
  }

  registerBlock(instance) {
    if (instance instanceof CommandBlock) {
      this.commands.push(instance)
    } else {
      return false
    }
    return true
  }


  removeInstance() {
    let result = null
    let position = -1
    if (instance instanceof CommandBlock) {
      for (const a of this.commands) {
        position++;
        if (a instanceof CommandBlock) {
          if (a._id == instance._id) {
            a.destroy()
            result = a
            this.commands.slice(position, position)
            break
          }
        }
      }
    }
    return result
  }


  static createCommandBlock(projectWrapper, command, options = {}) {
    let commandBlock = new CommandBlock(projectWrapper)

    commandBlock
      .watchOn()
      .create(command, options)

    return commandBlock
  }
}


module.exports.CommandUtils = {
  CommandBlock,
  CommandManagerTerminal
}