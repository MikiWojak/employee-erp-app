const path = require('node:path');
const nodemailer = require('nodemailer');
const { default: hbs } = require('nodemailer-express-handlebars');

// @TODO Rename to SendEmailHandler
// @TODO Restore sending emails
class Mailer {
    constructor(emailConfig, emailProducer) {
        this.emailProducer = emailProducer;

        const { host, port, secure, user, pass, address } = emailConfig;

        const hbsOptions = {
            viewEngine: {
                layoutsDir: path.join(__dirname, '../templates'),
                defaultLayout: 'base'
            },
            viewPath: path.join(__dirname, '../templates')
        };

        const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass
            }
        });

        transporter.use('compile', hbs(hbsOptions));

        this.fromAddress = address;
        this.transporter = transporter;
    }

    async send({ to, subject, template, context = {} }) {
        try {
            // const info = await this.transporter.sendMail({
            //     from: this.fromAddress,
            //     to,
            //     subject,
            //     template,
            //     context
            // });

            await this.emailProducer.produce(
                JSON.stringify({
                    from: this.fromAddress,
                    to,
                    subject,
                    template,
                    context
                })
            );

            // console.log(`Email sent: ${info.messageId}`);
        } catch (error) {
            console.error('Error while sending an email!');
            console.error(error);
        }
    }
}

module.exports = Mailer;
