class AbstractConsumer {
    constructor(queue) {
        this.queue = queue;
    }

    consume(message) {}
}

module.exports = AbstractConsumer;
