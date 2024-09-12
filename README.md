# employee-erp-app

## Table of content

- [App description](#app-description)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Database design and structure](#database-design-and-structure)
- [Installation](#installation)
- [Usage](#usage)

- [Screenshots](#screenshots)

## App description

**employee-erp-app** is a web application to manage human resources of the company. Both admin (boss) and employee can login to the application. The admin can manage employees, contracts and vacations. The employee can see their vacations summary and list of contracts. The employee can also manage their own vacations in a limited scope.

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

TODO

## Project structure

Project includes:

- Backend
  - Node.js - `backend-node`
  - Nest (WIP) - `backend-nest`
- Frontend
  - Vue.js - `frontend-vue`
  - Nuxt - `frontend-nuxt`
  - React.js - `frontend-react`
  - Next.js - `frontend-next`

You can run application using combination of selected Frontend and Backend

## Run Vue.js / Nuxt (frontend) and Node.js (backend)

Please bear in mind on default setup you can run one frontend app at the time! You should not run both `frontend-vue` / `frontend-nuxt`

1. Go to directory `backend-node`
2. Install and setup backend according to `README.md` inside
3. Make sure to set `APP_FRONTEND_URL=http://localhost:8080`
4. Go to directory `frontend-vue` / `frontend-nuxt`
5. Install and setup frontend according to `README.md` inside

Credentials (`backend-node`):

- email: `admin@erp.test` / `employee@erp.test`
- password: `test1234`

## Run React.js / Next.js (frontend) and Node.js (backend)

Please bear in mind on default setup you can run one frontend app at the time! You should not run both `frontend-react` / `frontend-next`

1. Go to directory `backend-node`
2. Install and setup backend according to `README.md` inside
3. Make sure to set `APP_FRONTEND_URL=http://localhost:3000`
4. Go to directory `frontend-react` / `frontend-next`
5. Install and setup frontend according to `README.md` inside

## What about Nest.js (WIP)?

- You can also use `backend-nest` instead of `backend-node`
- Please bear in mind work on `backend-nest` is still in progress. Thus, not all features are available
- <b>Currently I'm working on fixing `backend-nest` to make it work properly</b>

Credentials (`backend-nest`):

- email: `admin@erp.test` / `employee@erp.test`
- password: `Test123#`
