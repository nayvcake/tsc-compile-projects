const EventEmitter = require('events')

/**
 * @description Typescript interpreter interface to identify and load interpreter metadata and then forward to layers for better support for hot loading.
 */
class InterpreterInterface extends EventEmitter {
  constructor() {
    super();
  }





}


/**
 * @description It is a smart identifier to better understand the functions to improve layer separation which is for hot loading and fast restart.

 */
class IdentifyInterpreter {
  constructor(options = {
    /**
     * @description There are several events to identify and resolve function
     */
    eventType: 'unknown',
    /**
     * @description Reminder metadata for things important to development.

     */
    metadata: {},
    /**
     * @description Error enlisting occurred in Typescript
     * 
     */
    errors: [],
    /**
     * @description Maybe someday you 'll have use for it...
     */
    payload: {},
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
  }) {
    /**
     * @description There are several events to identify and resolve function
     */
    this.eventType = options.eventType ?? ''
    /**
     * @description Reminder metadata for things important to development.

     */
    this.metadata = options.metadata ?? {}
    /**
     * @description Error enlisting occurred in Typescript
     * 
     */
    this.errors = options.errors ?? []
    /**
     * @description Maybe someday you 'll have use for it...
     */
    this.payload = options.payload ?? {}
    /**
     * @description Identified has already been named in such events.
     */
    this.label = options.label ?? []
    /**
     * @description Small graph for CPU spike register that was created during the execution of the Typescript command.
     */
    this.tags = options.tags ?? []
    /**
     * @description Application was forced to restart due to excessive updates which can cause absurd changes and higher CPU spike.
     */
    this.forceRestart = options.tags ?? false
    /**
     * @description Estimated time marker for identification execution.
     */
    this.time = options.time ?? 0
  }
}

class ReadingData {

}


class TSErrorHandling {
  constructor(options = {
    errors: [],
    bars: [],
    time: 0,
    projectMetadata: {}
  }) {

  }
}


module.exports = class Interpreter {

  getEvent() {
    
  }

  static createDefault() {
  }

  static createIdentifyInterpreter(options) {
    return new IdentifyInterpreter(options)
  }
}