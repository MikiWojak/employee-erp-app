const di = require('./di');
const { queues } = require('./config');

(async () => {
    try {
        const connection = await di.get('queues.connection');
        const channel = await connection.createChannel();

        process.once('SIGINT', async () => {
            console.log('Closing consumer subscriptions');

            await channel.close();
            await connection.close();
        });

        const addConsumerToQueue = async (queueName, consumerDIName) => {
            const emailConsumer = di.get(consumerDIName);

            await channel.assertQueue(queueName, { durable: true });
            await channel.consume(
                queueName,
                message => emailConsumer.consume(message),
                { noAck: true }
            );
            console.log(`Consumer subscribed to queue: ${queueName}`);
        };

        await addConsumerToQueue(queues.email, 'queues.consumer.email');

        console.log('Waiting for messages...');
    } catch (err) {
        console.error(err);
    }
})();
