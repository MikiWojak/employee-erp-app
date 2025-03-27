class AbstractConsumer {
    constructor(queue) {
        this.queue = queue;
    }

    consume(msg) {}
}

module.exports = AbstractConsumer;
