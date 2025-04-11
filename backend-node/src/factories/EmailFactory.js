const UserStoreEmail = require('./emails/UserStoreEmail');
const ContractStoreEmail = require('./emails/ContractStoreEmail');
const PasswordChangedEmail = require('./emails/PasswordChangedEmail');

class EmailFactory {
    #emailTypes = {
        UserStoreEmail,
        ContractStoreEmail,
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
