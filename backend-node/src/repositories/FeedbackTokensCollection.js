const AbstractRepository = require('./AbstractRepository');

class FeedbackTokensCollectionRepository extends AbstractRepository {
    get model() {
        return this.db.FeedbackTokensCollection;
    }
}

module.exports = FeedbackTokensCollectionRepository;
