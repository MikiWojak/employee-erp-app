const AbstractRepository = require('./AbstractRepository');

class FeedbackTokenRepository extends AbstractRepository {
    get model() {
        return this.db.FeedbackToken;
    }
}

module.exports = FeedbackTokenRepository;
