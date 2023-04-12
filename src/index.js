'use strict'

const ctx = require('./context')

const {
  fetchUser,
  fetchRepos,
  fetchLanguages
} = require('./client/github')

const userRepository = require('./repository/user')

const refresh = async username => {
  if (!username) {
    throw new Error('No username provided')
  }

  const [user, repos] = await Promise.all([
    fetchUser(username),
    fetchRepos(username),
  ])
  
  if (!user) {
    throw new Error(`User ${username} not found`)
  }

  await Promise.all(repos.map(async repo => {
    repo.languages = await fetchLanguages(username, repo.name)
  }))

  user.repos = repos
  await userRepository.save(user)
  
  return user
}

module.exports = {
  refresh: username => ctx.run(refresh, username),
  show: params => ctx.run(userRepository.findBy, params)
}