'use strict'

const sinon = require('sinon').createSandbox()
const github = require('./client/github')

describe('App', () => {
  afterEach(() => sinon.verifyAndRestore())

  describe('refresh', () => {
    const tests = [
      {
        title: 'no username',
        username: null,
        error: 'No username provided',
      },
      {
        title: 'user not found',
        username: 'goku',
        error: 'User goku not found',
        setup: () => {
          sinon.stub(github, 'fetchUser').resolves(null)
          sinon.stub(github, 'fetchRepos').resolves([])
        }
      },
      {
        title: 'success',
        username: 'goku',
        setup: () => {
          const repo = require('./repository/user')
          const mock = sinon.mock(github)
          mock.expects('fetchUser')
            .once()
            .withArgs('goku')
            .resolves({
              username: 'goku',
              name: 'Kakarotto',
              location: 'Earth',
              email: 'goku@capsule.corp',
              type: 'Sayan',
            })
          mock.expects('fetchRepos')
            .once()
            .withArgs('goku')
            .resolves([
              { name: 'genki-dama' },
            ])
          mock.expects('fetchLanguages')
            .once()
            .withArgs('goku', 'genki-dama')
            .resolves(['JavaScript', 'Golang'])

          sinon.mock(repo).expects('save')
            .once()
            .withArgs({
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
            })
            .resolves()
        }
      },
    ]

    tests.forEach(test => {
      it(test.title, async () => {
        try {
          test.setup?.()
          await require('./index').refresh(test.username)
          if (test.error) sinon.assert.fail(`Expected "${test.error}" error`)
        } catch (e) {
          sinon.assert.match(e.message, test.error)
        }
      })
    })
  })

})
