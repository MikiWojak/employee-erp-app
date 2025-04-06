const di = require('./di');
const { queues } = require('./config');

(async () => {
    try {
        const channel = await di.get('queues.channel');

        const onShutdown = async () => {
            console.info('Closing queues');

            try {
                const connection = await di.get('queues.connection');

                await connection.close();

                process.exit(0);
            } catch (error) {
                console.error('Error on closing app!');

                process.exit(1);
            }
        };

        process.once('SIGINT', onShutdown);
        process.once('SIGTERM', onShutdown);

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
