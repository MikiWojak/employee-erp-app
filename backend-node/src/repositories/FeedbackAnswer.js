const AbstractRepository = require('./AbstractRepository');

class FeedbackAnswerRepository extends AbstractRepository {
    get model() {
        return this.db.FeedbackAnswer;
    }
}

module.exports = FeedbackAnswerRepository;
