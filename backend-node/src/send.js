// @TODO Remove later
const { connect } = require('amqplib');

(async () => {
    const connection = await connect('amqp://localhost');

    const channel = await connection.createChannel();

    const queue = 'messages';
    const message = 'Hello there!';

    await channel.assertQueue(queue, { durable: false });

    channel.sendToQueue(queue, Buffer.from(message));
})();
