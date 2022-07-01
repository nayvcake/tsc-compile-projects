/**
 * @description Validating if the log is an error.
 * @param {*} msg 
 * @returns 
 */
const validatorError = function (msg = '') {
  if (msg instanceof Buffer) {
    msg = msg.toString('utf-8')
  }
  if (msg.match(/error TS[0-9]+|error - TS[0-9]+|error - TS[0-9]+:/) === null) {
    return false
  }
  return true
}
/**
 * @description Validating that it is a log that is not an error.
 * @param {*} msg 
 * @returns 
 */
const validatorAnyLog = function (msg = '') {
  if (msg instanceof Buffer) {
    msg = msg.toString('utf-8')
  }
  if (msg.match(/[a-z] - TS[0-9]+|[A-Za-z\-] TS[0-9]+|[A-Za-z\-] TS[0-9]+:/g) === null) {
    return false
  }
  return true
}
/**
 * @description Validating that the log is an error counter at the end of the build.
 * @param {*} msg 
 * @returns 
 */
const validatorCountOfError = function (msg = '') {
  if (msg instanceof Buffer) {
    msg = msg.toString('utf-8')
  }
  if (msg.match(/Found [0-9]+ error\.|Found [0-9]+ error\. Watching for file changes|Found [0-9]+ errors\.|Found [0-9]+ errors\. Watching for file changes\./g) === null) {
    return false
  }
  return true
}


/**
 * @description Validating that this typescript is starting your project builder.
 * @param {*} msg 
 * @returns 
 */
const validatorStarting = function (msg = '') {
  if (msg instanceof Buffer) {
    msg = msg.toString('utf-8')
  }
  if (msg.match(/Starting compilation in watch mode/g) === null) {
    return false
  }
  return true
}


module.exports.Validator = {
  validatorError,
  validatorAnyLog,
  validatorCountOfError,
  validatorStarting
}