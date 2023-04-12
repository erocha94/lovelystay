'use strict'

const { AsyncLocalStorage } = require('node:async_hooks')
const als = new AsyncLocalStorage()

const get = key => key ? als.getStore().get(key)?.() : als.getStore()
const set = (key, value) => als.getStore().set(key, () => value)
const createStore = () => new Map(als.getStore()?.entries() ?? [
  ['database', () => require('../lib/database').connection],
])

module.exports = {
  get connection() {
    return get('database')
  },
  set connection(connection) {
    set('database', connection)
  },

  transaction(cb) {
    return this.run(() => {
      return this.connection.tx(tx => {
        this.connection = tx
        return cb()
      })
    })
  },

  run(cb, ...args) {
    return als.run(createStore(), cb, ...args)
  }
}
