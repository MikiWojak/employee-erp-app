class SendEmailHandler {
    constructor(emailProducer) {
        this.emailProducer = emailProducer;
    }

    async send({ to, subject, template, context = {} }) {
        try {
            await this.emailProducer.produce(
                JSON.stringify({
                    to,
                    subject,
                    template,
                    context
                })
            );
        } catch (error) {
            console.error('Error while sending email to queue!');
            console.error(error);
        }
    }
}

module.exports = SendEmailHandler;
