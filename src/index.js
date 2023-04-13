'use strict'

const ctx = require('./context')

const github = require('./client/github')
const userRepository = require('./repository/user')

const refresh = async username => {
  if (!username) {
    throw new Error('No username provided')
  }

  const [user, repos] = await Promise.all([
    github.fetchUser(username),
    github.fetchRepos(username),
  ])
  
  if (!user) {
    throw new Error(`User ${username} not found`)
  }

  await Promise.all(repos.map(async repo => {
    repo.languages = await github.fetchLanguages(username, repo.name)
  }))

  user.repos = repos
  await userRepository.save(user)
  
  return user
}

module.exports = {
  refresh: username => ctx.run(refresh, username),
  show: params => ctx.run(userRepository.findBy, params)
}
