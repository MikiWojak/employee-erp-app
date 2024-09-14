# employee-erp-app

## Table of content

- [App description](#app-description)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Screenshots](#screenshots)
  - [Screenshots React or Next](#screenshots-react-or-next)
  - [Installation Vue or Nuxt](#screenshots-vue-or-nuxt)
- [Installation](#installation)
  - [Installation backend Node](#installation-backend-node)
  - [Installation frontend React or Next](#installation-frontend-react-or-next)
  - [Installation frontend Vue or Nuxt](#installation-frontend-vue-or-nuxt)
- [Usage](#usage)
  - [Credentials for backend Node or Nest](#credentials-for-backend-node-or-nest)
  - [Usage frontend React or Next](#usage-frontend-react-or-next)
  - [Installation frontend Vue or Nuxt](#usage-frontend-vue-or-nuxt)

## App description

**employee-erp-app** is a web application to manage human resources of the company. Both admin (boss) and employee can login to the application. The admin can manage employees, contracts and vacations. The employee can see their vacations summary and list of contracts. The employee can also manage their own vacations in a limited scope.

The frontend is written using 4 frontend frameworks - React, Next.js, Vue.js and Nuxt. The backend is written in Node.js + Express. You can run application using combination of selected frontend and backend.

The work on the backend written in Nest.js is still in progress, thus not all features are available.

Project includes:

- Frontend
  - React - `frontend-react`
  - Next.js - `frontend-next`
  - Vue.js - `frontend-vue`
  - Nuxt - `frontend-nuxt`
- Backend
  - Node.js - `backend-node`
  - Nest (WIP) - `backend-nest`

## Features

### Admin

- Employees list (Dashboard)
- Add, edit and delete employee
- Contracts list
- Add, edit and delete contract
- Vacations list
- Add, edit and delete vacation

### Employee

- Logged employee's vacations summary (Dashboard)
- Logged employee's contracts list
- Logged employee's vacations list
- Add vacation request
- Edit and delete unapproved vacation request

### Additional information

- No registration - you can login using only initial accounts and ones created by Admin

## Tech stack

### Frontend

- React
  - React
  - TypeScript
- Next.js
  - Next.js
  - TypeScript
- Vue.js
  - Vue.js
- Nuxt
  - Nuxt

### Backend

- Node.js
  - Node.js
  - Express
  - Docker
  - Docker Compose
  - Redis
- Nest (WIP)
  - Nest
  - TypeScript
  - Docker
  - Docker Compose
  - Redis

### Others

- Git

## Screenshots

### Screenshots React or Next

Login
![image](screenshots/react/react-login.png)

Admin - Dashboard (list of employees)
![image](screenshots/react/react-admin-dashboard.png)

Admin - Add employee
![image](screenshots/react/react-admin-add-employee.png)

Admin - Contracts
![image](screenshots/react/react-admin-contracts.png)

Admin - Add contract
![image](screenshots/react/react-admin-add-contract.png)

Admin - Vacations
![image](screenshots/react/react-admin-vacations.png)

Admin - Add vacation
![image](screenshots/react/react-admin-add-vacation.png)

Employee - Dashboard (vacations summary)
![image](screenshots/react/react-employee-dashboard.png)

Employee - Contracts
![image](screenshots/react/react-employee-contracts.png)

Employee - Vacations
![image](screenshots/react/react-employee-vacations.png)

Employee - Add vacation
![image](screenshots/react/react-employee-add-vacation.png)

## Frontend Vuejs Nuxt Backend Nodejs

### Installation Vue or Nuxt

Login
![image](screenshots/vue/vue-login.png)

Admin - Dashboard (list of employees)
![image](screenshots/vue/vue-admin-dashboard.png)

Admin - Add employee
![image](screenshots/vue/vue-admin-add-employee.png)

Admin - Contracts
![image](screenshots/vue/vue-admin-contracts.png)

Admin - Add contract
![image](screenshots/vue/vue-admin-add-contract.png)

Admin - Vacations
![image](screenshots/vue/vue-admin-vacations.png)

Admin - Add vacation
![image](screenshots/vue/vue-admin-add-vacation.png)

Employee - Dashboard (vacations summary)
![image](screenshots/vue/vue-employee-dashboard.png)

Employee - Contracts
![image](screenshots/vue/vue-employee-contracts.png)

Employee - Vacations
![image](screenshots/vue/vue-employee-vacations.png)

Employee - Add vacation
![image](screenshots/vue/vue-employee-add-vacation.png)

## Installation

Please bear in mind on default setup you can run only one frontend app at the time. Do not run `frontend-react`, `frontend-next`, `frontend-vue` and `frontend-nuxt` simultaneously.

### Installation backend Node

1. Go to directory `backend-node`
2. Install and setup backend according to `README.md` inside
3. Before running the backend set env variable `APP_FRONTEND_URL` according to the frontend installation guide.

### Installation frontend React or Next

1. Setup backend according to [Installation backend Node](#installation-backend-node)
2. Make sure to set env variable `APP_FRONTEND_URL=http://localhost:3000`
3. Go to directory `frontend-react` / `frontend-next`
4. Install and setup frontend according to `README.md` inside

### Installation frontend Vue or Nuxt

1. Setup backend according to [Installation backend Node](#installation-backend-node)
2. Make sure to set env variable `APP_FRONTEND_URL=http://localhost:3000`
3. Go to directory `frontend-vue` / `frontend-nuxt`
4. Install and setup frontend according to `README.md` inside

## Usage

### Credentials for backend Node or Nest

Initial credentials fro backend Node or Nest

- Admin:
  - email: `admin@erp.test`
  - password: `Qwerty123!`
- Employee:
  - email: `employee@erp.test`
  - password: `Qwerty123!`

### Usage frontend React or Next

1. Go to `http://localhost:3000` (default settings)
2. Login using credentials listed in [Credentials for backend Node or Nest](#credentials-for-backend-node-or-nest)

### Usage frontend Vue or Nuxt

1. Go to `http://localhost:8080` (default settings)
2. Login using credentials listed in [Credentials for backend Node or Nest](#credentials-for-backend-node-or-nest)
