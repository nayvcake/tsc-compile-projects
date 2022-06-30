const EventEmitter = require('events')
const {
  IdentifyInterpreter,
  TSInterpreter
} = require('./interpreter')


/**
 * @description This class was built to load and carry the payload over the Typescript construct to bring up important classes like Full Lava Bucket.
 */
class BucketLava {
  constructor(interpreter, hotreload) {
    this.loading = 0
    this.internalTime = null
    if (hotreload instanceof HotReloadResource) {
      this.hotreload = hotreload
    } else {
      throw Error('A terrible bug has occurred. Report this in the project.')
    }
    if (interpreter instanceof IdentifyInterpreter) {
      this.interpreter = interpreter
    } else {
      throw Error('A terrible bug has occurred. Report this in the project.')
    }
  }

  del() {
    this.hotreload.buckets.delete(this.interpreter.payload.project.name)
    clearInterval(this.internalTime)
    this.internalTime = null
  }

  create() {
    this.internalTime = setInterval(() => {
      // Checking ... 
      if (this.loading === 0) {
        this.interpreter.on('restarting', {
          bucketLava: this,
          interpreter: this.interpreter,
          hotreload: this.hotreload
        })


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
    this.projectWrapper = projectWrapper
    this.buckets = new Map()
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
  }
  
  createBucket(interpreter, options) {
    if (interpreter instanceof IdentifyInterpreter) {
      if (interpreter.isWatch) {
        this.buckets.set(interpreter.payload.project.name, new BucketLava(interpreter, this))
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