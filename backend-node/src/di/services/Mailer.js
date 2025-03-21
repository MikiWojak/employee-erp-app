// const {
//     redisSession: { url, port, pass }
// } = require('../../config');
// @TODO Config

const nodemailer = require('nodemailer');

class MailerFactory {
    static create() {
        const transporter = nodemailer.createTransport({
            port: 1025
        });

        console.log('Mailer transporter created!');

        return transporter;
    }
}

module.exports = MailerFactory;
