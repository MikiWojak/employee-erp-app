const path = require('node:path');
const nodemailer = require('nodemailer');

const AbstractConsumer = require('./AbstractConsumer');

class EmailConsumer extends AbstractConsumer {
    constructor(queue, emailConfig) {
        super(queue);

        const { default: hbs } = require('nodemailer-express-handlebars');

        const { host, port, secure, user, pass, address } = emailConfig;

        const hbsOptions = {
            viewEngine: {
                layoutsDir: path.join(__dirname, '../../../templates'),
                defaultLayout: 'base'
            },
            viewPath: path.join(__dirname, '../../../templates')
        };

        this.fromAddress = address;
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass
            }
        });
        this.transporter.use('compile', hbs(hbsOptions));
    }

    async consume(message) {
        console.log(`Received message from queue "${this.queue}"`);

        if (!message) {
            console.warn('No message to send!');

            return;
        }

        try {
            const parsedMessage = JSON.parse(message.content.toString());
            const { to, subject, template, context } = parsedMessage;

            await this.transporter.sendMail({
                from: this.fromAddress,
                to,
                subject,
                template,
                context
            });

            console.log(`Email sent`);
        } catch (error) {
            console.error('Error while sending an email!');
            console.error(error);
        }
    }
}

module.exports = EmailConsumer;
