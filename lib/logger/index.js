'use strict'

const logger = require('log4js').getLogger()
logger.level = process.env.LOG_LEVEL || 'debug'

module.exports = logger
