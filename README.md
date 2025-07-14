# employee-erp-app

## Table of content

- [App description](#app-description)
- [Installation](#installation)
    - [Backend](#installation-backend)
    - [Frontend](#installation-frontend)
- [Usage](#usage)
    - [Backend (dev)](#usage-backend-dev)
    - [Backend (test)](#usage-backend-test)
    - [Frontend (dev)](#usage-frontend-dev)
    - [Default credentials](#default-credentials)

## App description

Web application to manage: workers, contracts, vacations, suggestions and feedback. Allows to operate as: admin, manager and employee.

## Installation

<h3 id="installation-backend">Backend</h3>

Go to backend directory.

```
cd backend-node
```

Set proper Node.js version. Install if necessary.

```
nvm use
```

Install dependencies.

```
npm install
```

Copy env file and set proper data. You can also leave it default in local environment.

```
cp .env.example .env
```

Run Docker containers in the background.

```
docker compose up -d
```

Setup database.

```
npm run db-setup-fresh
```

<h3 id="installation-frontend">Frontend</h3>
Go to frontend directory.

```
cd frontend-vue
```

Set proper Node.js version. Install if necessary.

```
nvm use
```

Install dependencies.

```
npm install
```

Copy env file and set proper data. You can also leave it default in local environment.

```
cp .env.example .env
```

## Usage

<h3 id="usage-backend-dev">Backend (dev)</h3>
Go to backend directory.

```
cd backend-node
```

Set proper Node.js version in every terminal for backend.

```
nvm use
```

Run Docker containers in the background if not running yet.

```
docker compose up -d
```

Run backend in dev mode.

```
npm run dev
```

Run queues in separate terminal.

```
npm run queues
```

Close docker containers (only after backend and queues closed).

```
docker compose down
```

<h3 id="usage-backend-test">Backend (test)</h3>
Go to backend directory.

```
cd backend-node
```

Set proper Node.js version.

```
nvm use
```

Copy env file and set proper data. You can also leave it default in local test environment.

```
cp .env.test.example .env.test
```

Run test Docker containers in the background.

```
docker compose -f docker-compose.prod.yml --env-file .env.test up -d
```

Setup test database.

```
npm run db-setup-test
```

Run tests.

```
npm test
```

Close test Docker containers.

```
docker compose -f docker-compose.prod.yml --env-file .env.test down
```

<h3 id="usage-frontend-dev">Frontend (dev)</h3>
Go to frontend directory.

```
cd frontend-vue
```

Set proper Node.js version.

```
nvm use
```

Run frontend in dev mode.

```
npm run dev
```

### Default credentials

#### Admin

Email

```
admin@erp.test
```

Password

```
Qwerty123!
```

#### Manager

Email

```
manager@erp.test
```

Password

```
Qwerty123!
```

#### Employee

Email

```
employee@erp.test
```

Password

```
Qwerty123!
```
