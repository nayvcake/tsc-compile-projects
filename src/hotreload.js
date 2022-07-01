const EventEmitter = require('events')
const {
  CommandUtils
} = require('./commands')
const {
  IdentifyInterpreter,
  TSInterpreter
} = require('./interpreter')


/**
 * @description This class was built to load and carry the payload over the Typescript construct to bring up important classes like Full Lava Bucket.
 */
class BucketLava extends EventEmitter {
  constructor(interpreter, hotreload, commandBlock) {
    super()
    this.loading = 0
    this.restartBy = []
    if (commandBlock instanceof CommandUtils.CommandBlock) {
      this.commandBlock = commandBlock
    }
    this.internalTime = null
    if (hotreload instanceof HotReloadResource) {
      this.hotreload = hotreload
    } else {
      throw Error('A terrible bug has occurred. Report this in the project.')
    }
    // if (interpreter instanceof IdentifyInterpreter) {
    //   this.interpreter = interpreter
    // } else {
    //   throw Error('A terrible bug has occurred. Report this in the project.')
    // }
  }

  del() {
    // this.hotreload.buckets.delete(this.interpreter.payload.project.name)
    clearInterval(this.internalTime)
    this.internalTime = null
  }


  restartTime() {
    clearInterval(this.internalTime)
    this.internalTime = null
    this.createTime()
  }

  createTime() {
    this.internalTime = setInterval(() => {
      // Checking ... 
      if (this.loading === 0) {
        this.emit('restarting', {
          bucketLava: this,
          interpreter: null,
          hotreload: this.hotreload,
          restartBy: this.restartBy
        })

        for (const a of this.restartBy) {
          this.restartBy.pop()
        }

        setTimeout(() => {
          this.commandBlock.restart()
        }, 1 * 1000) // Added 1 seconds of delay.

        clearInterval(this.internalTime)
        this.internalTime = null
      }
    }, 900)
  }
}

/**
 * @description This class is a hot load handler to load the buckets first before making the application restart.When the bucket is full we must get another bucket to wait
  for it to
  finally be emptied. That 's the logic.

 */
class HotReloadResource extends EventEmitter {
  constructor(projectWrapper) {
    super();
    this.projectWrapper = projectWrapper
    this.buckets = new Map()
    this.restart = 0
    this.restarting = {}
    this.on('createBucket', (interpreter) => {
      if (interpreter instanceof IdentifyInterpreter) {
        if (interpreter.isWatch) {
          this.createBucket(interpreter, {})
        }
      }
    })
    this.on('removeBucket', (project) => {
      if (this.buckets.get(project.name) == undefined) {
        this.buckets.get(project.name).del()
      }
    })
    this.on('alertOfRestart', (identifyInterpreter) => {
      this.addRestart(identifyInterpreter)
    })
  }

  removeRestart(identifyInterpreter) {

    for (const node of this.buckets) {
      for (const n of node) {
        if (n instanceof BucketLava) {

          n.restartTime()
          if (identifyInterpreter instanceof IdentifyInterpreter) {
            for (const a of n.restartBy) {
              if (identifyInterpreter.projectName == a) {
                this.restart--
                n.loading--
                n.restartBy.push(identifyInterpreter.projectName)
              }
            }
          }
        }
      }
    }
  }


  addRestart(identifyInterpreter) {
    for (const node of this.buckets) {
      for (const n of node) {
        if (n instanceof BucketLava) {

          n.restartTime()
          if (identifyInterpreter instanceof IdentifyInterpreter) {
            for (const a of n.restartBy) {
              if (identifyInterpreter.projectName !== a) {
                this.restart++
                n.loading++
                n.restartBy.push(identifyInterpreter.projectName)
              }
            }
          }
        }
      }
    }
  }

  createBucketWithoutInterpreter(commandBlock) {
    return this.buckets.set(Math.random(Math.floor() * 100000000), new BucketLava(null, this, commandBlock))
  }
  /**
   * @testing true
   * @param {*} interpreter 
   * @param {*} commandBlock 
   */
  createBucket(interpreter, commandBlock) {
    if (interpreter instanceof IdentifyInterpreter) {
      if (interpreter.isWatch) {
        this.buckets.set(interpreter.payload.project.name, new BucketLava(interpreter, this, commandBlock))
      }
    }
  }

  create(identifyInterpreter) {
    if (identifyInterpreter instanceof IdentifyInterpreter) {
      this.emit('createBucket', identifyInterpreter)
    }
  }
}

/**
 * @description Exporting the important hot restart classes for hot dough applications and commands.
 */
module.exports.HotReloadUtils = {
  /**
   * @description This class was built to load and carry the payload over the Typescript construct to bring up important classes like Full Lava Bucket.
   */
  BucketLava,
  /**
   * @description This class is a hot load handler to load the buckets first before making the application restart.When the bucket is full we must get another bucket to wait
    for it to
    finally be emptied. That 's the logic.
  */
  HotReloadResource
}