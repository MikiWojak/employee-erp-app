# employee-erp-app

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

## Run React.js / Next.js (frontend) and Node.js (backend)

Please bear in mind on default setup you can run one frontend app at the time! You should not run both `frontend-react` / `frontend-next`

1. Go to directory `backend-node`
2. Install and setup backend according to `README.md` inside
3. Make sure to set `APP_FRONTEND_URL=http://localhost:3000`
4. Go to directory `frontend-react` / `frontend-next`
5. Install and setup frontend according to `README.md` inside

## What about Nest.js (WIP)

- You can also use `backend-nest` instead of `backend-node`
- Please bear in mind work on `backend-nest` is still in progress. Thus not all features are available
