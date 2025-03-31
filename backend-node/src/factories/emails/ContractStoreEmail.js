const BaseEmail = require('./BaseEmail');

class ContractStoreEmail extends BaseEmail {
    _template = 'contract_store';
    _subject = 'New contract';

    _generate({ firstName, position, startDate, endDate }) {
        return {
            firstName,
            position,
            startDate,
            endDate
        };
    }
}

module.exports = ContractStoreEmail;
