const {
  Event
} = require('./events')

/**
 * @description This is to extract the important data to add to the base of the important class.
 * @param {*} msg String input for data extraction.
 * @returns data
 */
const trackError = function (msg = '') {
  let data = {
    file: '',
    isError: true,
    code: '',
    event: Event.ERROR_TS,
    message: '',
    errorTS: '',
  }

  const getMessage = msg.replace(/.* error TS[0-9]+:/g, '')
  const getFile = msg.replace(/(\.ts.*)/g, '') + '.ts'
  const getCodeError = msg.match(/TS[0-9]+/g)[0] ?? ''

  data.message = getMessage
  data.file = getFile
  data.code = getCodeError


  return data
}

/**
 * @description This is to extract the important data to add to the base of the important class.
 * @param {*} msg String input for data extraction.
 * @returns data
 */
const trackOther = function (msg = '') {
  let data = {
    file: '',
    isError: false,
    code: '',
    event: Event.EVENT_ANY,
    message: '',
    errorTS: '',
  }

  const getMessage = msg.replace(/.* error TS[0-9]+:/g, '')
  const getFile = msg.replace(/(\.ts.*)/g, '') + '.ts'
  const getCodeError = msg.match(/[a-z] TS[0-9]+/g)[0] ?? ''

  data.message = getMessage
  data.file = getFile
  data.code = getCodeError


  return data
}


/**
 * @description To extract amount of error.
 * @param {*} msg String input for data extraction.
 * @returns data
 */
const trackInfo = function (msg = '') {
  let data = {
    count: parseInt(msg.replace(/[A-Za-z:.\[\]!@#$%¨&*()_]+/g, '')) ?? 0,
  }
  return data
}



module.exports.Tracking = {
  trackError,
  trackInfo,
  trackOther
}