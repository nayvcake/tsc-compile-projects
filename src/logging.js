module.exports = class Logging {
  static emitLog(projectWrapper, ...args) {
    projectWrapper.emit('logging', args)
  }
}