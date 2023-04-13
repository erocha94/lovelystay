'use strict'

exports.up = async function(knex) {
  await Promise.all([
    knex.raw(`
      CREATE TABLE IF NOT EXISTS users (
        id INT GENERATED ALWAYS AS IDENTITY,
        username VARCHAR (255) UNIQUE NOT NULL,
        email VARCHAR (255) UNIQUE NULL,
        name VARCHAR (255) NULL,
        type VARCHAR (32) NULL,
        location VARCHAR (255) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY (id)
      )
    `),
    knex.raw(`
      CREATE TABLE IF NOT EXISTS programming_languages (
        id INT GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255) UNIQUE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY (id)
      )
    `),
  ])

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS repositories (
      id INT GENERATED ALWAYS AS IDENTITY,
      user_id INT NOT NULL,
      name VARCHAR (255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_user
        FOREIGN KEY (user_id)
          REFERENCES users (id),
      PRIMARY KEY (id),
      UNIQUE (user_id, name)
    )
  `)
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS repository_languages (
      repository_id INT NOT NULL,
      language_id INT NOT NULL,
      CONSTRAINT fk_repository
        FOREIGN KEY (repository_id)
          REFERENCES repositories (id),
      CONSTRAINT fk_language
        FOREIGN KEY (language_id)
          REFERENCES programming_languages (id),
      PRIMARY KEY (repository_id, language_id)
    )
  `)
};

exports.down = async function(knex) {
  await knex.raw('DROP TABLE IF EXISTS repository_languages')
  await knex.raw('DROP TABLE IF EXISTS repositories')
  await Promise.all([
    knex.raw('DROP TABLE IF EXISTS programming_languages'),
    knex.raw('DROP TABLE IF EXISTS users'),
  ])
};
