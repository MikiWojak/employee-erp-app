// @TODO Remove later
const { connect } = require('amqplib');

(async () => {
    const connection = await connect('amqp://localhost');

    const channel = await connection.createChannel();

    const queue = 'messages';

    await channel.assertQueue(queue, { durable: false });

    await channel.consume(queue, msg => {
        console.log(`[x] Received ${msg.content.toString()}`);
    });
})();
