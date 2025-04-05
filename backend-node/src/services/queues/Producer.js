class Producer {
    channel;
    connected = false;

    constructor(connection, queue) {
        this.connection = connection;
        this.queue = queue;
    }

    async connect() {
        if (this.connected && this.channel) {
            return;
        }

        this.connected = true;

        try {
            this.channel = await Promise.resolve(this.connection).then(
                connection => connection.createChannel()
            );

            await this.channel.assertQueue(this.queue, { durable: true });
        } catch (error) {
            console.error(error);
            console.error('No connection to queue channel!');
        }
    }

    async produce(message) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            this.channel.sendToQueue(this.queue, Buffer.from(message), {
                persistent: true
            });

            console.log(`Message sent to queue "${this.queue}"`);
        } catch (error) {
            console.error(error);

            console.log(`Failed to send message to queue "${this.queue}"`);
        }
    }
}

module.exports = Producer;
