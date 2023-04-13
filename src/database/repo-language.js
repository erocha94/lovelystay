'use strict'

const R = require('ramda')
const ctx = require('../context')

module.exports = {
  async save(repoID, languageID) {
    let stmt = `
      INSERT INTO repository_languages(repository_id, language_id)
      VALUES ($1, $2)
      ON CONFLICT (repository_id, language_id) DO NOTHING
      RETURNING *
    `

    const params = [repoID, languageID]
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
      SELECT * FROM repository_languages
      WHERE repository_id = $1 AND language_id = $2
      LIMIT 1
    `
    return ctx.connection
      .result(stmt, params)
      .then(R.prop('rows'))
      .then(R.head)
  },  
}
