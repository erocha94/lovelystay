'use strict'

const R = require('ramda')
const { request } = require('../../lib/http/client')
const DEFAULT = {
  baseURL: 'https://api.github.com',
  method: 'GET',
}

const mapUser = R.compose(
  R.pick(['username', 'name', 'email', 'type', 'location']),
  R.converge(R.assoc('username'), [R.prop('login'), R.identity]),
  R.propOr({}, 'data'),
)

const mapRepositories = R.compose(
  R.map(R.pick(['name'])),
  R.propOr([], 'data'),
)

const mapLanguages = R.compose(
  R.keys,
  R.propOr({}, 'data'),
)

const handleError = e => {
  if (e.response?.status === 404) {
    return null
  }
  throw e
}

module.exports = {
  fetchUser(username) {
    const cfg = { ...DEFAULT, url: `/users/${username}` }
    return request(cfg)
      .then(mapUser)
      .catch(handleError)
  },
  fetchRepos(username) {
    const cfg = { ...DEFAULT, url: `/users/${username}/repos` }
    return request(cfg)
      .then(mapRepositories)
      .catch(handleError)
  },
  fetchLanguages(username, repo) {
    const cfg = { ...DEFAULT, url: `/repos/${username}/${repo}/languages` }
    return request(cfg)
      .then(mapLanguages)
      .catch(handleError)
  },
}
