const UserStoreEmail = require('./emails/UserStoreEmail');
const UserDestroyEmail = require('./emails/UserDestroyEmail');
const PasswordResetEmail = require('./emails/PasswordResetEmail');
const PasswordChangedEmail = require('./emails/PasswordChangedEmail');

class EmailFactory {
    #emailTypes = {
        UserStoreEmail,
        UserDestroyEmail,
        PasswordResetEmail,
        PasswordChangedEmail
    };

    create(emailType, to, data) {
        const fullEmailType = `${emailType}Email`;

        if (!this.#emailTypes.hasOwnProperty(fullEmailType)) {
            throw new Error(
                `${emailType} (${fullEmailType}) is not a valid email type`
            );
        }

        const emailTemplate = new this.#emailTypes[fullEmailType]();

        return emailTemplate.generate(to, data);
    }
}

module.exports = EmailFactory;
