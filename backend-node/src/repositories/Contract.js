const deepmerge = require('deepmerge');
const { isPlainObject } = require('is-plain-object');

const AbstractRepository = require('./AbstractRepository');

class ContractRepository extends AbstractRepository {
    get model() {
        return this.db.Contract;
    }

    getById(id, options = {}) {
        const deepmergeOptions = {
            isMergeableObject: isPlainObject
        };

        const args = deepmerge(
            options,
            {
                include: [
                    {
                        association: 'user',
                        required: true
                    }
                ]
            },
            deepmergeOptions
        );

        return this.findById(id, args);
    }
}

module.exports = ContractRepository;
