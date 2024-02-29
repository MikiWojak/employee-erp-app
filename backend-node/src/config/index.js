require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const env = (key, defaultValue = null) => process.env[key] || defaultValue;
const isEnabled = key => env(key) && env(key) === 'true';

const config = {
    app: {
        env: env('NODE_ENV'),
        url: env('APP_URL', 'http://localhost:3001'),
        port: parseInt(env('PORT', 3001)),
        frontendUrl: env('APP_FRONTEND_URL')
    },
    db: {
        url:
            env('DATABASE_DIALECT', 'mysql') +
            '://' +
            env('DATABASE_USERNAME', 'guest') +
            ':' +
            env('DATABASE_PASSWORD', 'guest') +
            '@' +
            env('DATABASE_HOST', 'localhost') +
            ':' +
            env('DATABASE_PORT', 3306) +
            '/' +
            env('DATABASE_NAME', 'db'),
        host: env('DATABASE_HOST', 'localhost'),
        name: env('DATABASE_NAME'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        dialect: env('DATABASE_DIALECT', 'mysql'),
        port: parseInt(env('DATABASE_PORT', 3306)),
        logging: isEnabled('SEQUELIZE_LOGGING') ? console.log : false,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: true
        }
    },
    redis: {
        url: env('REDIS_URL'),
        port: env('REDIS_PORT')
    }
};

module.exports = config;
