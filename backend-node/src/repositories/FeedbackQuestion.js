const AbstractRepository = require('./AbstractRepository');

class FeedbackQuestionRepository extends AbstractRepository {
    get model() {
        return this.db.FeedbackQuestion;
    }
}

module.exports = FeedbackQuestionRepository;
