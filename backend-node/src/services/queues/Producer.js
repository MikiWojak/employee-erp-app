class Producer {
    connected = false;

    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }

    async connect() {
        if (this.connected) {
            return;
        }

        this.connected = true;

        try {
            this.channel = await this.channel;

            await this.channel.assertQueue(this.queue, { durable: true });
        } catch (error) {
            console.error(error);
            console.error('No connection to queue channel!');
        }
    }

    async produce(message) {
        try {
            if (!this.connected) {
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
