const BaseEmail = require('./BaseEmail');

class ContractStoreEmail extends BaseEmail {
    _template = 'contract_store';
    _subject = 'New contract';

    _generate({ firstName, lastName, position, startDate, endDate }) {
        return {
            fullName: `${firstName} ${lastName}`,
            position,
            startDate,
            endDate
        };
    }
}

module.exports = ContractStoreEmail;
