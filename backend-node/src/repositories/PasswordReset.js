const deepmerge = require('deepmerge');

const AbstractRepository = require('./AbstractRepository');

class PasswordResetRepository extends AbstractRepository {
    get model() {
        return this.db.PasswordReset;
    }

    findByToken(token, options = {}) {
        const args = deepmerge(options, { where: { token } });

        return this.model.findOne(args);
    }
}

module.exports = PasswordResetRepository;
