'use strict'

const pgp = require('pg-promise')()
const knex = () => require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: ['knex', 'public'],
  migrations: {
    directory: './lib/database/migrations',
  },
})

let connection

module.exports = {
  get connection() {
    return connection
  },
  
  connect() {
    connection = pgp(process.env.PG_CONNECTION_STRING)
    return connection.result('SELECT 1')
  },
  shutdown() {
    return connection?.$pool?.end()
  },

  migrate: {
    create(name) {
      const instance = knex()
      return instance.migrate
        .make(name)
        .finally(() => instance.destroy())
    },

    up() {
      const instance = knex()
      return instance.migrate
        .latest()
        .finally(() => instance.destroy())
    },

    down() {
      const instance = knex()
      return instance.migrate
        .rollback()
        .finally(() => instance.destroy())
    },
  },
}
