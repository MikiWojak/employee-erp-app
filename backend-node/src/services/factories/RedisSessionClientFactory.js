const {
    redisSession: { url, port, pass }
} = require('../../config');

const redis = require('redis');

class RedisSessionClientFactory {
    static create() {
        const redisClient = redis.createClient({
            host: url,
            port,
            password: pass
        });

        return redisClient;
    }
}

module.exports = RedisSessionClientFactory;
