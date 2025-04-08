const AbstractRepository = require('./AbstractRepository');

class PasswordResetRepository extends AbstractRepository {
    get model() {
        return this.db.PasswordReset;
    }
}

module.exports = PasswordResetRepository;
