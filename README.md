<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


# Chat Application API

This is a basic chat application backend built with **NestJS**, **PostgreSQL**, **Socket.IO**, and **Redis**. It includes user authentication, post creation, and a chat module supporting 1-1 and group chats. Swagger is used for API documentation.

/* 
  Topic: Create a new project

  - Basic authentication
  - Create a post, view the post list
  - Create a chat module (1-1, group)
  - Using Swagger to view the API list
*/
Tech: SocketIO, Nestjs, Docker, Redis, Postgresql, and anything else you can use. 
## Features

- **Authentication**: JWT-based authentication for users.
- **Post Management**: Users can create posts and view the list of posts.
- **Chat Module**: 1-1 and group chats powered by Socket.IO.
- **API Documentation**: Swagger integrated for easy API exploration.

## Requirements

- Node.js (>= v16.x)
- Docker & Docker Compose (if using Docker)
- PostgreSQL (if running manually)
- Redis (if running manually)


## Getting Started

### 1. Clone the Repository

git clone https://github.com/PhiTranViet/project-app.git
cd project-app

### 2. Environment Configuration
Create a .env file in the project root directory and add the following variables:
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=chat_app

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret

# App
APP_PORT=3000


### 3. Running with Docker

Step 1: Build and Run Containers

The project includes a docker-compose.yml file to easily set up PostgreSQL, Redis, and the NestJS application. Run the following command:
docker-compose up --build

This will start the application on http://localhost:3000 and expose the following services:

	•	API: http://localhost:3003
	•	Swagger API Documentation: http://localhost:3003/api-docs
	•	PostgreSQL: localhost:5432
	•	Redis: localhost:6379

Step 2: Database Initialization

Once the containers are up, the application will automatically initialize the database using TypeORM, and any new changes will be synchronized.


### 4. Running Without Docker

If you want to run the application manually without Docker, follow these steps:

Step 1: Install Dependencies

Make sure you have PostgreSQL and Redis running locally. Then, install the dependencies:

npm install

Step 2: Configure PostgreSQL and Redis

Ensure that PostgreSQL and Redis are running and configured properly according to the values in your .env file.

Step 3: Run the Application

npm run start

The application will start on http://localhost:3000, and you can access the Swagger API documentation at http://localhost:3000/docs.



API Endpoints

Authentication

	•	POST /auth/login: Log in and receive a JWT token.
	•	POST /auth/register: Register a new user.

Users

	•	GET /users: Get a list of all users.
	•	GET /users/:id: Get a specific user by ID.
	•	PUT /users/:id: Update user information.
	•	DELETE /users/:id: Delete a user.

Posts

	•	POST /posts: Create a new post.
	•	GET /posts: Get a list of posts.

Chat

	•	POST /chat/group: Create a group chat.
	•	POST /chat/message: Send a message in a chat.
	•	GET /chat/:id: Get chat messages by chat ID.

Swagger Documentation

The Swagger documentation is available at:
http://localhost:3000/docs


Technologies Used

	•	NestJS: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
	•	PostgreSQL: Relational database for storing user and chat data.
	•	Redis: In-memory data structure store used for caching and pub/sub messaging.
	•	Socket.IO: Real-time, bidirectional event-based communication.
	•	TypeORM: ORM used for database interaction and synchronization.
	•	Docker: Used for containerization to run the app and its services.





## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - PhiTran
- Email - phitranviet99@gmail.com
- Linkedin - [(https://www.linkedin.com/in/phitrantech/)]

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
