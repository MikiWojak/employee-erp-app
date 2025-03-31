const UserStoreEmail = require('./emails/UserStoreEmail');
const ContractStoreEmail = require('./emails/ContractStoreEmail');

class EmailFactory {
    emailTypes = {
        UserStoreEmail,
        ContractStoreEmail
    };

    create(emailType, to, data) {
        // @TODO What if not exist?
        const fullEmailType = `${emailType}Email`;
        const emailTemplate = new this.emailTypes[fullEmailType]();

        return emailTemplate.generate(to, data);
    }
}

module.exports = EmailFactory;
