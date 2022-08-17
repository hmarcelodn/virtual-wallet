
# NodeJS - Virtual Wallet

The virtual wallet allow users to signup and securely send/receive payments between them.

It has been developed using Node.JS runtime and Typescript backed by Postgres database powered by TypeORM.

## Features

 - Login
 - Logout
 - Signup
 - Fill walllet
 - Pay from the wallet to other users
 - Withdraw from the wallet
 - Get balance information
 - Get forecast information
 - Get transaction series
 - Convert balance between exchange rates

## Requirements

### Project tools

 1. Docker
 2. Docker Compose
 3. NodeJS Runtime

### Developer Tools

1. Visual Code IDE
2. PgAdmin4
3. Postman
  
  ## Quick Start

Install project dependencies as follows:

    npm run install

Open 2 terminals, one for  provisioning infrastructure using docker and another window for running the project.

**For terminal 1:**

    docker-compose up
**For terminal 2:**

    npm run start:dev
 This will use nodemon to startup the backend. Another variation without nodemon maybe:

    npm run start

## Conventional Commits

It uses commitlint for conventional comments. It has many advantages so its a good idea to do so from the beggining. In order to commit the project do the following:

    git add .
    npm run commit

It will display a wizard which will guide the commit comments. Once the commit is made, next the project needs to push the changes to the remote repository:

    git push
