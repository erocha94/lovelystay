'use strict'

const sinon = require('sinon').createSandbox()

const ctx = require('../context')

const users = require('../database/user')
const repositories = require('../database/repo')
const languages = require('../database/language')
const repoLanguages = require('../database/repo-language')

describe('User repository', () => {
  afterEach(() => sinon.verifyAndRestore())
  before(() => sinon.stub(ctx, 'transaction').callsFake(cb => cb()))
  // force stub reloading
  beforeEach(() => delete require.cache[require.resolve('./user')])

  describe('save', () => {
    const tests = [
      {
        title: 'success',
        dto: {
          username: 'goku',
          name: 'Kakarotto',
          location: 'Earth',
          email: 'goku@capsule.corp',
          type: 'Sayan',
          repos: [
            {
              name: 'genki-dama',
              languages: ['JavaScript', 'Golang'],
            },
          ],
        },
        setup: () => {
          sinon.mock(users)
            .expects('save')
            .once()
            .withArgs({
              username: 'goku',
              name: 'Kakarotto',
              location: 'Earth',
              email: 'goku@capsule.corp',
              type: 'Sayan',
            })
            .resolves({
              id: 1,
              username: 'goku',
              name: 'Kakarotto',
              location: 'Earth',
              email: 'goku@capsule.corp',
              type: 'Sayan',
            })
          
          sinon.mock(repositories)
            .expects('save')
            .once()
            .withArgs(
              1, { name: 'genki-dama', languages: ['JavaScript', 'Golang'] }
            )
            .resolves({ id: 2, user_id: 1, name: 'genki-dama' })
          
          const l = sinon.mock(languages)
          l.expects('save')
            .once()
            .withArgs('JavaScript')
            .resolves({ id: 3, name: 'JavaScript' })
          l.expects('save')
            .once()
            .withArgs('Golang')
            .resolves({ id: 4, name: 'Golang' })

          const rl = sinon.mock(repoLanguages)
          rl.expects('save')
            .once()
            .withArgs(2, 3)
            .resolves()
          rl.expects('save')
            .once()
            .withArgs(2, 4)
            .resolves()
        }
      },
    ]

    tests.forEach(test => {
      it(test.title, () => {
        test.setup?.()
        return require('./user').save(test.dto)
      })
    })
  })

})
