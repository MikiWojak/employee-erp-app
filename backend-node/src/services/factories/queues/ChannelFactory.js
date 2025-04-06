class ChannelFactory {
    static async create(connection) {
        const channel = await Promise.resolve(connection).then(connection =>
            connection.createChannel()
        );

        const id = Math.random().toString(36).substring(2);
        console.info(`Queue channel created #ID ${id}`);

        return channel;
    }
}

module.exports = ChannelFactory;
