const crypto = require('crypto');

class ChannelFactory {
    static async create(connection) {
        const channel = await Promise.resolve(connection).then(connection =>
            connection.createChannel()
        );

        const id = crypto.randomBytes(8).toString('hex');
        console.info(`Queue channel instance #${id}`);

        return channel;
    }
}

module.exports = ChannelFactory;
