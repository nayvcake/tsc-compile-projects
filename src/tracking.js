const trackError = function (msg = '', out, options) {
  let data = {
    file: '',
    isError: true,
    code: '',
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



module.exports = {
  trackError
}