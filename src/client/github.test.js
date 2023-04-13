'use strict'

const client = require('../../lib/http/client')
const github = require('./github')
const sinon = require('sinon').createSandbox()

describe('GitHub client', () => {
  afterEach(() => sinon.verifyAndRestore())

  describe('fetchUser', () => {
    const tests = [
      {
        title: 'should fetch and map correctly',
        payload: {
          data: {
            login: 'goku',
            email: 'goku@capsule.corp',
            location: 'Earth',
            name: 'Kakarotto',
            type: 'Sayan',
            hunger: 100,
          }
        },
        expected: {
          username: 'goku',
          email: 'goku@capsule.corp',
          location: 'Earth',
          name: 'Kakarotto',
          type: 'Sayan',
        },
      }
    ]

    tests.forEach(test => {
      it(test.title, async () => {
        sinon.stub(client, 'do').resolves(test.payload)
        const result = await github.fetchUser('goku')
        sinon.assert.match(result, test.expected)
        sinon.assert.calledOnce(client.do)
        sinon.assert.calledWith(client.do, {
          baseURL: 'https://api.github.com',
          method: 'GET',
          url: '/users/goku',
        })
      })
    })
  })

  describe('fetchRepos', () => {
    const tests = [
      {
        title: 'should fetch and map correctly',
        payload: {
          data: [
            {
              name: 'Genki Dama',
              power: 9001,
            },
          ],
        },
        expected: [
          { name: 'Genki Dama' },
        ],
      }
    ]

    tests.forEach(test => {
      it(test.title, async () => {
        sinon.stub(client, 'do').resolves(test.payload)
        const result = await github.fetchRepos('goku')
        sinon.assert.match(result, test.expected)
        sinon.assert.calledOnce(client.do)
        sinon.assert.calledWith(client.do, {
          baseURL: 'https://api.github.com',
          method: 'GET',
          url: '/users/goku/repos',
        })
      })
    })
  })

  describe('fetchLanguages', () => {
    const tests = [
      {
        title: 'should fetch and map correctly',
        payload: {
          data: {
            JavaScript: 100,
            Golang: 200,
          },
        },
        expected: ['JavaScript', 'Golang'],
      }
    ]

    tests.forEach(test => {
      it(test.title, async () => {
        sinon.stub(client, 'do').resolves(test.payload)
        const result = await github.fetchLanguages('goku', 'genki-dama')
        sinon.assert.match(result, test.expected)
        sinon.assert.calledOnce(client.do)
        sinon.assert.calledWith(client.do, {
          baseURL: 'https://api.github.com',
          method: 'GET',
          url: '/repos/goku/genki-dama/languages',
        })
      })
    })
  })
})
