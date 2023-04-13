'use strict'

const R = require('ramda')
const ctx = require('../context')

module.exports = {
  async save(language) {
    let stmt = `
      INSERT INTO programming_languages(name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING
      RETURNING *
    `
    const params = [language]
    const entity = await ctx.connection
      .result(stmt, params)
      .then(R.prop('rows'))
      .then(R.head)

    // inserted
    if (entity) {
      return entity
    }

    // INSERT conflicted, so RETURNING is empty
    // need to fetch with SELECT
    stmt = `
      SELECT * FROM programming_languages
      WHERE name = $1
    `
    return ctx.connection
      .result(stmt, params)
      .then(R.prop('rows'))
      .then(R.head)
  }
}
