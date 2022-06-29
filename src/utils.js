const removeItems = (msg) => {
  if (msg instanceof Buffer) {
    msg = msg.toString('utf-8')
  }
  return msg.replace(/[0-9]+:[0-9]+:[0-9]+ -/g, '')
}

module.exports.UtilsTSC = {
  removeItems
}