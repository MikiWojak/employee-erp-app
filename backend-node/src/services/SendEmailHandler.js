class SendEmailHandler {
    constructor(emailProducer, emailFactory) {
        this.emailProducer = emailProducer;
        this.emailFactory = emailFactory;
    }

    async handle(type, to, data = {}) {
        try {
            const emailData = this.emailFactory.create(type, to, data);

            await this.emailProducer.produce(JSON.stringify(emailData));
        } catch (error) {
            console.error('Error while sending email to queue!');
            console.error(error);
        }
    }
}

module.exports = SendEmailHandler;
