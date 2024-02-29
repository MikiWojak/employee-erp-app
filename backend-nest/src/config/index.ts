require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const env = (key, defaultValue = undefined) => process.env[key] || defaultValue;
const isEnabled = key => env(key) && env(key) === 'true';

if (!['production', 'development', 'test'].includes(env('NODE_ENV'))) {
    console.error('NODE_ENV has wrong option');
    process.exit();
}

export default () => ({
    app: {
        env: env('NODE_ENV'),
        url: env('APP_URL', 'http://localhost:3001'),
        port: parseInt(env('PORT', 3001)),
        frontendUrl: env('APP_FRONTEND_URL')
    },
    session: {
        secret: env('SESSION_SECRET')
    },
    db: {
        host: env('DATABASE_HOST', 'localhost'),
        database: env('DATABASE_NAME'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        type: env('DATABASE_DIALECT', 'mysql'),
        port: parseInt(env('DATABASE_PORT', 3306)),
        logging: isEnabled('TYPEORM_LOGGING'),
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: true
        }
    },
    redisSession: {
        host: env('SESSION_REDIS_HOST'),
        port: parseInt(env('SESSION_REDIS_PORT')),
        pass: env('SESSION_REDIS_PASS'),
        password: env('SESSION_REDIS_PASS'),
        ttl: parseInt(env('SESSION_REDIS_TTL'))
    }
});
