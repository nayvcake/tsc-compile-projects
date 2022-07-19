const EventEmitter = require('events');
const {
  Event
} = require('./events');
const {
  Tracking
} = require('./tracking');
const {
  Validator
} = require('./validator');
const {
  UtilsTSC
} = require('./utils')

/**
 * @description A small package to decorate the metadata entry.
 */
class MetadataInterPreter {
  constructor(options = {
    /**
     * @description Event ID to understand the encoding of the log.
     */
    eventName: Event.EVENT_UNKNOWN,
    /**
     * @description Log metadata to select and insert event metadata and to improvise data in required functions.
     */
    metadata: {},
  }) {
    /**
     * @description Event ID to understand the encoding of the log.
     */
    this.eventName = options.eventName
    /**
     * @description Log metadata to select and insert event metadata and to improvise data in required functions.
     */
    this.metadata = options.metadata
  }
}

/**
 * @description Typescript interpreter interface to identify and load interpreter metadata and then forward to layers for better support for hot loading.
 */
class InterpreterInterface extends EventEmitter {
  constructor() {
    super();
  }

  /**
   * @description A method that will manage the events to trigger the event load in the class mainly being extended to the main base. Once the data is analyzed we will be able to manage the events better to have the best hot reload.
   */
  eventOn(metadataInterpreter = new MetadataInterPreter(), dataOriginal, interpreter) {
    if (dataOriginal instanceof Buffer) {
      dataOriginal = dataOriginal.toString('utf-8')
    }
    if (dataOriginal === undefined) {
      dataOriginal = null
    }

    const parse = ReadingData.parsingData(metadataInterpreter.eventName, metadataInterpreter.metadata)

    this.emit(parse.event, parse.metadata, metadataInterpreter, this)
    this.emit('debug', parse.metadata, metadataInterpreter, this)
    this.emit('debugData', {
      eventName: metadataInterpreter.eventName,
      metadataInterpreter: metadataInterpreter,
      dataOriginal: dataOriginal,
      parse: parse,
      interpreterInterface: this,
      interpreter: interpreter
    })
  }
}


/**
 * @description It is a smart identifier to better understand the functions to improve layer separation which is for hot loading and fast restart.

 */
class IdentifyInterpreter {
  constructor(options = {
    projectName: '',
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
     * @description Set the project name for identification.
     */
    this.projectName = options.projectName === 'string' ? 'unknown' :  options.projectName
    /**
     * @description There are several events to identify and resolve function
     */
    this.eventType = typeof options.eventType === 'string' ? options.eventType : ''
    /**
     * @description Reminder metadata for things important to development.

     */
    this.metadata = typeof options.metadata === 'object' ? options.metadata : {}
    /**
     * @description Error enlisting occurred in Typescript
     * 
     */
    this.errors = typeof options.errors === 'object' ? options.errors : []
    /**
     * @description Maybe someday you 'll have use for it...
     */
    this.payload = typeof options.payload === 'object' ? options.payload : {}
    /**
     * @description Identified has already been named in such events.
     */
    this.label = typeof options.label === 'object' ? options.label : []
    /**
     * @description Small graph for CPU spike register that was created during the execution of the Typescript command.
     */
    this.tags = typeof options.tags === 'object' ? options.tags : []
    /**
     * @description Application was forced to restart due to excessive updates which can cause absurd changes and higher CPU spike.
     */
    this.forceRestart = typeof options.forceRestart === 'boolean' ? options.forceRestart : false
    /**
     * @description Estimated time marker for identification execution.
     */
    this.time = typeof options.time === 'number' ? options.time : 0


    this.isWatch = false
  }


  parse() {
    return new MetadataInterPreter({
      eventName: this.eventType,
      metadata: this.metadata
    })
  }
}


/**
 * @description Read the log data to be able to identify possible errors, warnings, trace, debug, and other unknown logs.
 */
class ReadingData {
  /**
   * @description Analyzing the metadata to choose the best data important to the events.
   * @param {*} event 
   * @param {*} data 
   * @returns 
   */
  static parsingData(event = Event.EVENT_UNKNOWN, data = '') {
    if (event == Event.ERROR_TS) {
      return {
        event: Event.ERROR_TS,
        metadata: Tracking.trackError(data),
      }
    } else if (event == Event.EVENT_ANY) {
      return {
        event: Event.EVENT_ANY,
        metadata: Tracking.trackOther(data),
      }
    } else if (event == Event.STARTING_COMPILATION) {
      return {
        event: Event.STARTING_COMPILATION,
        metadata: {
          file: '',
          isError: false,
          code: '',
          event: Event.STARTING_COMPILATION,
          message: 'Watch mode...'
        },
      }
    } else if (event == Event.EVENT_FIND_COUNT_OF_ERROR) {
      return {
        event: Event.EVENT_FIND_COUNT_OF_ERROR,
        metadata: Tracking.trackInfo(data),
      }
    }

    if (data instanceof Buffer) {
      data = UtilsTSC.removeItems(msg.a.toString('utf-8'))
    }

    return {
      event: Event.EVENT_UNKNOWN,
      metadata: {
        file: '',
        isError: false,
        code: '',
        event: Event.EVENT_ANY,
        message: data,
      },
    }
  }
}


/**
 * @description This class can effectively read and create events to be able to manage hot loading and other library resources.
 */
class TSInterpreter extends InterpreterInterface {
  constructor() {
    super();
  }
  /**
   * @description Identify which event is being handled to finally be valid and load to other resources.
   * @returns Validator
   */
  validateEvent(data) {
    let isValid = false
    let eventName = Event.EVENT_UNKNOWN

    if (Validator.validatorAnyLog(data)) {
      isValid = true
      eventName = Event.EVENT_ANY
    }

    if (Validator.validatorError(data)) {
      isValid = true
      eventName = Event.ERROR_TS
    }

    if (Validator.validatorCountOfError(data)) {
      isValid = true
      eventName = Event.EVENT_FIND_COUNT_OF_ERROR
    }
    return {
      isValid: isValid,
      eventName: eventName
    }
  }









  /**
   * @description Identify which event is being handled to finally be valid and load to other resources.
   * @returns Validator
   */
  static validateEvent(data) {
    let isValid = false
    let eventName = Event.EVENT_UNKNOWN

    if (Validator.validatorStarting(data)) {
      return {
        isValid: true,
        eventName: Event.STARTING_COMPILATION
      }
    }

    if (Validator.validatorError(data)) {
      return {
        isValid: true,
        eventName: Event.ERROR_TS
      }
    }


    if (Validator.validatorAnyLog(data)) {
      return {
        isValid: true,
        eventName: Event.EVENT_ANY
      }
    }

    if (Validator.validatorCountOfError(data)) {
      return {
        isValid: true,
        eventName: Event.EVENT_FIND_COUNT_OF_ERROR
      }
    }

    return {
      isValid: isValid,
      eventName: eventName
    }
  }

  /**
   * @description Pattern the variables to make reading logs more efficient to get ID logging for feature enhancements.
   */
  static createDefault() {
    return new TSInterpreter()
  }


  /**
   * @description Create a pattern to identify and make the answer as smart as possible to improve code performance.
   * @param {*} options 
   * @returns 
   */
  static createIdentifyInterpreter(options = {
    projectName: '',
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
    return new IdentifyInterpreter(options)
  }


}

module.exports = {
  TSInterpreter,
  ReadingData,
  MetadataInterPreter,
  IdentifyInterpreter
}
