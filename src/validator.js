/**
 * @description Validating if the log is an error.
 * @param {*} msg 
 * @returns 
 */
const validatorError = function (msg = '') {
  return msg.match(/error TS[0-9]+|error - TS[0-9]+/g).length != 0
}
/**
 * @description Validating that it is a log that is not an error.
 * @param {*} msg 
 * @returns 
 */
const validatorAnyLog = function (msg = '') {
  return msg.match(/[a-z] - TS[0-9]+|[a-z] TS[0-9]+/g).length != 0
}
/**
 * @description Validating that the log is an error counter at the end of the build.
 * @param {*} msg 
 * @returns 
 */
const validatorCountOfError = function (msg = '') {
  return msg.match(/[a-z] - TS[0-9]+|[a-z] TS[0-9]+/g).length != 0
}



module.exports.Validator = {
  validatorError,
  validatorAnyLog,
  validatorCountOfError
}