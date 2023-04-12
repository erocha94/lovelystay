'use strict'

const R = require('ramda')
const ctx = require('../context')

const {
  findBy,
  save: saveUser,
} = require('../database/user')

const {
  save: saveRepo
} = require('../database/repo')

const {
  save: saveLanguage
} = require('../database/language')

const {
  save: saveRepoLanguage
} = require('../database/repo-language')

const save = dto => {
  return ctx.transaction(async () => {
    const user = R.omit(['repos'], dto)
    const repos = dto.repos ?? []
  
    const userID = await saveUser(user).then(R.prop('id'))
    await Promise.all(repos.map(async repo => {
      const[repoID, ...languages] = await Promise.all([
        saveRepo(userID, repo).then(R.prop('id')),
        ...R.map(saveLanguage, repo.languages),
      ])
  
      await Promise.all(R.map(l => saveRepoLanguage(repoID, l.id), languages))
    }))
  })
}

module.exports = {
  findBy,
  save,
}