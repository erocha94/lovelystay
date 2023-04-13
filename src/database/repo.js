'use strict'

const R = require('ramda')
const ctx = require('../context')

module.exports = {
  async save(userID, repo) {
    let stmt = `
      INSERT INTO repositories(user_id, name)
      VALUES ($1, $2)
      ON CONFLICT (user_id, name) DO NOTHING
      RETURNING *
    `
  
    const params = [userID, repo.name]
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
      SELECT * FROM repositories
      WHERE user_id = $1 AND name = $2
    `
    return ctx.connection
      .result(stmt, params)
      .then(R.prop('rows'))
      .then(R.head)
  },
}
