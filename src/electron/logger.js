const util = require('util')
const { EventEmitter } = require('events')

class Logger extends EventEmitter {
  log (type, ...args) {
    const row = util.format(...args)
    process.stdout.write(type + ' ' + row + '\n')
    const message = {
      key: `logs-${process.hrtime().join()}`,
      value: {
        timestamp: new Date(),
        type,
        message: row
      }
    }
    this.emit('message', message)
  }
}

global.logger = new Logger()

console.log = (...args) => global.logger.log('Log', ...args)
console.debug = (...args) => global.logger.log('Debug', ...args)
console.error = (...args) => global.logger.log('Error', ...args)
