'use strict'

const R = require('ramda')
const ctx = require('../context')

module.exports = {
  findBy(params) {
    params = R.pick(['location', 'language'], params)
  
    let join = ''
    const where = []
    const values = []
    if (params.language) {
      join += `
        LEFT JOIN repositories r ON r.user_id = u.id
        LEFT JOIN repository_languages rl ON rl.repository_id = r.id
        LEFT JOIN programming_languages pl ON rl.language_id = pl.id
      `
      where.push(`LOWER(pl.name) = LOWER($${where.length + 1})`)
      values.push(params.language)
    }
  
    if (params.location) {
      where.push(`LOWER(u.location) LIKE LOWER($${where.length + 1})`)
      values.push(`%${params.location}%`)
    }
  
    const stmt = `
      SELECT u.* FROM users u
      ${join}
      ${where.length ? `WHERE ` + where.join(' AND ') : '' }
    `
  
    return ctx.connection
      .result(stmt, values)
      .then(R.prop('rows'))
  },

  save(dto) {
    const stmt = `
      INSERT INTO users ($(this:name))
      VALUES ($(this:csv))
      ON CONFLICT (username) DO UPDATE
      SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        location = EXCLUDED.location,
        type = EXCLUDED.type
      RETURNING *
    `

    return ctx.connection
      .result(stmt, dto)
      .then(R.prop('rows'))
      .then(R.head)
  },
}