const nodemailer = require('nodemailer');

class Mailer {
    constructor(emailConfig) {
        const { host, port, secure, user, pass, address } = emailConfig;

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

        console.log('Mailer created!');
    }

    // @TODO Queues
    // @TODO HTML Templates
    async send({ to, subject, html }) {
        const info = await this.transporter.sendMail({
            from: this.fromAddress,
            to,
            subject,
            html
        });

        console.log(`Message sent: ${info.messageId}`);
    }
}

module.exports = Mailer;
