'use strict'

const logger = require('./lib/logger')
const db = require('./lib/database')
const app = require('./src')
const cmd = require('minimist')(process.argv.slice(2), {
  default: { fetch: '', show: false, filter: '' },
  boolean: ['show'],
  string: ['fetch', 'filter'],
})
const { fetch: username, show, filter } = cmd

;(async () => {
  logger.debug('Starting application')
  if (!username && !show) {
    throw new Error('please provide either --fetch or --show parameters')
  }

  logger.debug('Connecting to database')
  await Promise.all([
    db.init(),
    db.migrate.up(),
  ])

  let data
  if (username) {
    logger.debug(`Fetching user ${username}`)
    data = await app.refresh(username)
  } else {
    let filters = filter
    if (filter && !Array.isArray(filter)) {
      filters = [filter]
    }

    const params = filters.reduce?.((acc, f) => {
      const [k, v] = f.split('=')
      if (k && v) acc[k] = v
      return acc
    }, {})

    logger.debug('Showing users with filter:', params || 'none')
    data = await app.show(params || {})
  }

  logger.info(JSON.stringify(data))
})()
  .catch(e => logger.error(e))
  .finally(db.shutdown)