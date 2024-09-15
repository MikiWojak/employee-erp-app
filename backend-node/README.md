# employee-erp-app - backend-node

## Installation

```bash
# Set proper node version
nvm use

# Install dependencies
npm install

# Copy env file and set proper data inside
# You can also leave default env variables
cp .env.example .env

# Docker setup
docker network create global
docker compose up -d

# Database setup
npm run db-setup-fresh

# Close docker containers
docker compose down
```

## Run for development - compiles and hot reloads

```bash
npm run dev
```

## Run tests

```bash
# Copy env file and set proper data inside
# You can also leave default env variables
cp .env.test.example .env.test

# Docker setup
docker compose --env-file .env.test up -d

# Database setup
npm run db-setup-test

# Run tests
npm test

# Close docker containers
docker compose --env-file .env.test down
```
