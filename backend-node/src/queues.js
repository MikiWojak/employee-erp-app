const di = require('./di');
const { queues } = require('./config');
const onShutdown = require('./plugins/shutdown');

(async () => {
    try {
        const channel = await di.get('queues.channel');

        process.once('SIGINT', async () => onShutdown(di));
        process.once('SIGTERM', async () => onShutdown(di));

        const addConsumerToQueue = async (queueName, consumerDIName) => {
            const emailConsumer = di.get(consumerDIName);

            await channel.assertQueue(queueName, { durable: true });
            await channel.consume(
                queueName,
                message => emailConsumer.consume(message),
                { noAck: true }
            );
            console.info(`Consumer subscribed to queue: ${queueName}`);
        };

        await addConsumerToQueue(queues.email, 'queues.consumer.email');

        console.info('Waiting for messages...');
    } catch (err) {
        console.error(err);
    }
})();
