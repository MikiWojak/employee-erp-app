const {
    redis: { url, port }
} = require('../../config');

const redis = require('redis');

class RedisSessionClientFactory {
    static create() {
        const redisClient = redis.createClient({
            host: url,
            port
        });

        return redisClient;
    }
}

module.exports = RedisSessionClientFactory;
