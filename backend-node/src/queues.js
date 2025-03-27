const amqp = require('amqplib');

const {
    queues,
    rabbitmq: { user, password, host, port }
} = require('./config');
const di = require('./di');

(async () => {
    try {
        const connection = await amqp.connect(
            `amqp://${user}:${password}@${host}:${port}`
        );
        const channel = await connection.createChannel();

        process.once('SIGINT', async () => {
            console.log('Closing consumer subscriptions');

            await channel.close();
            await connection.close();
        });

        const emailConsumer = di.get('queues.consumer.email');

        await channel.assertQueue(queues.email, { durable: true });
        await channel.consume(
            queues.email,
            message => emailConsumer.consume(message),
            { noAck: true }
        );
        console.log(`Consumer subscribed to queue: ${queues.email}`);

        console.log('Waiting for messages...');
    } catch (err) {
        console.error(err);
    }
})();
