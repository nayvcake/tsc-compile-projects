const EventEmitter = require('events')

class CommandBlock extends EventEmitter {
  constructor(projectWrapper) {
    this.commandRunning = null
    this.command = ''
    this.started = Date.now()
    this.restarted = 0
    this.projectWrapper = projectWrapper
  }

  

  create(command, options) {
    const {
      spawn
    } = require('child_process');
    this.commandRunning = spawn(command, options)
    this.commandRunning.stdout.on('data', async (data) => {
      if (data instanceof Buffer) {
        this.emit('log', data.toString('utf-8'))
      } else if (data instanceof String) {
        this.emit('log', data)
      } else {
        try {
          this.emit('log', JSON.parse(data))
        } catch (_) {}
      }
    })
    this.commandRunning.on('exit', () => {
      this.commandRunning = null
      this.emit('exit', true, this)
    })
    this.commandRunning.on('disconnect', () => {
      this.commandRunning = null
      this.emit('disconnect', true, this)
    })
    this.commandRunning.on('error', (err) => {
      this.commandRunning.kill(-1)
      this.commandRunning = null
      this.emit('error', err, this)
    })
    this.command = command
    this.started = Date.now()
    this.restarted = 0
  }

  watchOn() {
    this.on('kill', () => this.commandRunning.kill(-1))
    return this
  }
}

class CommandManagerTerminal extends EventEmitter {
  constructor(projectWrapper) {
    this.commands = []
    this.projectWrapper = projectWrapper
  }
}


module.exports.CommandUtils = {
  CommandBlock,
  CommandManagerTerminal
}