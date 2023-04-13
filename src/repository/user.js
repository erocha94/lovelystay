'use strict'

const R = require('ramda')
const ctx = require('../context')

const users = require('../database/user')
const repositories = require('../database/repo')
const languages = require('../database/language')
const repoLanguages = require('../database/repo-language')

const saveLanguages = R.map(languages.save)
const saveUser = R.compose(
  R.andThen(R.prop('id')),
  users.save
)
const saveRepository = R.compose(
  R.andThen(R.prop('id')),
  repositories.save
)
const saveRepoLanguage = R.useWith(repoLanguages.save, [
  R.identity,
  R.prop('id')
])

const save = dto => {
  return ctx.transaction(async () => {
    const user = R.omit(['repos'], dto)
    const repos = dto.repos ?? []

    const userID = await saveUser(user)
    await Promise.all(repos.map(async repo => {
      const results = await Promise.all([
        saveRepository(userID, repo),
        ...saveLanguages(repo.languages),
      ])

      const repoID = results.shift()
      await Promise.all(R.map(saveRepoLanguage(repoID), results))
    }))
  })
}

module.exports = {
  findBy: users.findBy,
  save,
}
