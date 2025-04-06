class ConnectionFactory {
    static async create(amqplib, { url, timeout }) {
        const connection = await amqplib.connect(url, { timeout });

        const id = Math.random().toString(36).substring(2);
        console.info(`Queue connection created #ID ${id}`);

        return connection;
    }
}

module.exports = ConnectionFactory;
