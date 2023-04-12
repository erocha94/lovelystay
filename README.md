# lovelystay challenge

Your goal is to develop a command-line application using NodeJS + TypeScript (or just Javascript/NodeJS) + PostgreSQL, whose goals are:

1. Fetch information about a given GitHub user (passed as a command-line argument) using the [GitHub API](https://docs.github.com/en/rest), and store it on one or more database tables - the mandatory fields are Name and Location, but you will get bonus points for additional fields;
2. Using a different command-line option, it should be possible to fetch and display all users already on the database (showing them on the command line);
3. Improving on the previous requirement, it should also be possible to list users only from a given location (again, using a command-line option);
4. Finally, the application should also query the programming languages this user seems to know/have repositories with, and store them on the database as well - allowing to query a user per location and/or programming languages;

## Requirements

- You must use NodeJS, TypeScript, and PostgreSQL;
- You should setup the database using migrations, if possible (preferably using SQL, but not mandatory) - feel free to use external tools or libraries for this purpose;
- Code should be split into database functions and general processing functions, when possible;
- For database access, you must use this library: https://github.com/vitaly-t/pg-promise
- For the processing (business logic) functions you should use either native ES6 functions or the library https://ramdajs.com/docs/ (or both);
- All async functions must be composable, meaning you can call them in sequence without asynchronicity issues;
- You shall have one main function and you should avoid process.exit() calls to the bare minimum;
- You must not use classes, as it is not justified for such a small app (we use almost no classes on our code);
- Your code must be safe, assume all input strings as insecure and avoid SQL injections;
- Each line shall not exceed 80 characters (bonus points if you include/follow some eslint rules), and it should use 2 spaces instead of tabs;
- Your code must be uploaded to GitHub, GitLab, or bitbucket, and you shall present it as a Pull Request over your very first commit;
- And finally, very important, don't forget to include a proper ReadMe.md, that documents your application and tells us how to use it.

# Setup

## Preconditions

- Docker installation

## Step by step

1. Duplicate `.env.example` to `.env` and edit if needed (the default values should work)

2. Download project dependencies

```bash
make install
```

3. Create app environment (postgres)

```bash
make env
```

4. Enter node.js container bash

```bash
make enter
```

From here you will have the necessary conditions to execute the application

## Fetching a user

```bash
node index.js --fetch <username>
```

Fetches a user from the github API and saves it on the database.

## Showing users

```bash
node index.js --show [--filter key=value]
```

Displays all users that were saved on the database.

Filterable by `language` or `location` with the `--filter` flag
