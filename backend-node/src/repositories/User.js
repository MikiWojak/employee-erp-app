const deepmerge = require('deepmerge');
const { isPlainObject } = require('is-plain-object');

const AbstractRepository = require('./AbstractRepository');

class UserRepository extends AbstractRepository {
    get model() {
        return this.db.User;
    }

    findByEmail(email, options = {}) {
        const args = deepmerge(options, { where: { email } });

        return this.model.findOne(args);
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
                        association: 'role',
                        required: true
                    },
                    {
                        association: 'avatar'
                    },
                    {
                        association: 'department'
                    }
                ]
            },
            deepmergeOptions
        );

        return this.findById(id, args);
    }
}

module.exports = UserRepository;
