'use strict'

const sinon = require('sinon').createSandbox()
const ctx = require('../context')

describe('Repository Languages table', () => {
  afterEach(() => sinon.verifyAndRestore())

  describe('save', () => {
    const tests = [
      {
        title: 'upsert with no conflict',
        setup() {
          const db = { result() {} }
          sinon.mock(db)
            .expects('result')
            .once()
            .withArgs(sinon.match.string, [1, 2])
            .resolves({ rows: [{ id: 1 }] })
            
          sinon.stub(ctx, 'connection').get(() => db)
        }
      },
      {
        title: 'upsert with conflict',
        setup() {
          const db = { result() {} }
          sinon.mock(db)
            .expects('result')
            .twice()
            .withArgs(sinon.match.string, [1, 2])
            .onCall(0).resolves({ rows: [] })
            .onCall(1).resolves({ rows: [{ id: 1 }] })
            
          sinon.stub(ctx, 'connection').get(() => db)
        }
      },
    ]

    tests.forEach(test => {
      it(test.title, () => {
        test.setup?.()
        return require('./repo-language').save(1, 2)
      })
    })
  })

})
