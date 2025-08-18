const crypto = require('crypto');

class ConnectionFactory {
    static async create(amqplib, { url, timeout }) {
        const connection = await amqplib.connect(url, { timeout });

        const id = crypto.randomBytes(8).toString('hex');
        console.info(`Queue connection instance #${id}`);

        return connection;
    }
}

module.exports = ConnectionFactory;
