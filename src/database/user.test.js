'use strict'

const sinon = require('sinon').createSandbox()
const ctx = require('../context')

describe('Users table', () => {
  afterEach(() => sinon.verifyAndRestore())

  describe('findBy', () => {
    const tests = [
      {
        title: 'location filter',
        filters: {
          location: 'porto',
        },
        setup() {
          const sqlExpectation = `
            SELECT u.* FROM users u
            WHERE LOWER(u.location) LIKE LOWER($1)
            GROUP BY u.id`
            .replaceAll(/\s{2,}/g, ' ').trim()

          const db = { result() {} }
          sinon.mock(db)
            .expects('result')
            .once()
            .callsFake((stmt, params) => {
              stmt = stmt.replaceAll(/\s{2,}/g, ' ').trim()
              sinon.assert.match(stmt, sqlExpectation)
              sinon.assert.match(params, ['%porto%'])
              return Promise.resolve({ rows: [{ id: 1 }] })
            })
            
          sinon.stub(ctx, 'connection').get(() => db)
        }
      },
      {
        title: 'language filter',
        filters: {
          language: 'javascript',
        },
        setup() {
          const sqlExpectation = `
            SELECT u.* FROM users u
            LEFT JOIN repositories r ON r.user_id = u.id
            LEFT JOIN repository_languages rl ON rl.repository_id = r.id
            LEFT JOIN programming_languages pl ON rl.language_id = pl.id
            WHERE LOWER(pl.name) = LOWER($1)
            GROUP BY u.id
          `.replaceAll(/\s{2,}/g, ' ').trim()

          const db = { result() {} }
          sinon.mock(db)
            .expects('result')
            .once()
            .callsFake((stmt, params) => {
              stmt = stmt.replaceAll(/\s{2,}/g, ' ').trim()
              sinon.assert.match(stmt, sqlExpectation)
              sinon.assert.match(params, ['javascript'])
              return Promise.resolve({ rows: [{ id: 1 }] })
            })
            
          sinon.stub(ctx, 'connection').get(() => db)
        }
      },
      {
        title: 'all filters',
        filters: {
          location: 'porto',
          language: 'javascript'
        },
        setup() {
          const sqlExpectation = `
            SELECT u.* FROM users u
            LEFT JOIN repositories r ON r.user_id = u.id
            LEFT JOIN repository_languages rl ON rl.repository_id = r.id
            LEFT JOIN programming_languages pl ON rl.language_id = pl.id
            WHERE LOWER(pl.name) = LOWER($1)
            AND LOWER(u.location) LIKE LOWER($2)
            GROUP BY u.id
          `.replaceAll(/\s{2,}/g, ' ').trim()

          const db = { result() {} }
          sinon.mock(db)
            .expects('result')
            .once()
            .callsFake((stmt, params) => {
              stmt = stmt.replaceAll(/\s{2,}/g, ' ').trim()
              sinon.assert.match(stmt, sqlExpectation)
              sinon.assert.match(params, ['javascript', '%porto%'])
              return Promise.resolve({ rows: [{ id: 1 }] })
            })
            
          sinon.stub(ctx, 'connection').get(() => db)
        }
      },
    ]

    tests.forEach(test => {
      it(test.title, () => {
        test.setup?.()
        return require('./user').findBy(test.filters)
      })
    })
  })

})
