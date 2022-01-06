# MyForumServer

API for [MyForum-React](https://github.com/akcer/MyForum-React) App

## Demo

[MyForum-Server](https://my-forum-server.herokuapp.com/)

## Requirements

- MySQL

## Installation

- Clone project

```bash
git clone https://github.com/akcer/MyForum-Server.git
```

- Enter the project directory:

```bash
cd MyForumServer
```

- Create .env file

```bash
touch .env
```

- Add following environment variables:

```bash
PORT=3001
CLIENT_HOST=http://localhost:3000
DB= databese name
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=database username
DB_PASSWORD=database password
DB_SYNCHRONIZE=true
DB_AUTOLOADENTITIES=true
JWT_ACCESS_TOKEN_SECRET=JWT secretKey
JWT_ACCESS_TOKEN_EXPIRATION_TIME=100
JWT_REFRESH_TOKEN_SECRET=JWT secretKey
JWT_REFRESH_TOKEN_EXPIRATION_TIME=100000
```

- Install NPM dependencies:

```bash
npm install
```

- Run the development server:

```bash
npm run start:dev
```

- Go to <http://localhost:3001> to access the API.

## Technologies

- TypeScript
- NestJS
- GraphQL
- TypeORM
- JWT authorization
