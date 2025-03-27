const amqp = require('amqplib');

class Producer {
    connection;
    channel;
    connected = false;

    constructor(rabbitmqOptions, queue) {
        this.rabbitmqOptions = rabbitmqOptions;
        this.queue = queue;
    }

    async connect() {
        if (this.connected && this.channel) {
            return;
        }

        this.connected = true;

        try {
            const { user, password, host, port } = this.rabbitmqOptions;

            this.connection = await amqp.connect(
                `amqp://${user}:${password}@${host}:${port}`
            );

            this.channel = await this.connection.createChannel();
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

            this.channel.sendToQueue(this.queue, Buffer.from(message));

            console.log(`Message sent to queue "${this.queue}"`);
        } catch (error) {
            console.error(error);

            console.log(`Failed to send message to queue "${this.queue}"`);
        }
    }
}

module.exports = Producer;
