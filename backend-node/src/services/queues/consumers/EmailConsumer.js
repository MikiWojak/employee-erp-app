const AbstractConsumer = require('./AbstractConsumer');

class EmailConsumer extends AbstractConsumer {
    consume(message) {
        if (message) {
            console.log(`Received message from queue "${this.queue}"`);
            console.log({
                message: JSON.parse(message.content.toString())
            });
        }
    }
}

module.exports = EmailConsumer;
