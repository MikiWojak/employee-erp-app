const AbstractRepository = require('./AbstractRepository');

class SuggestionCommentRepository extends AbstractRepository {
    get model() {
        return this.db.SuggestionComment;
    }
}

module.exports = SuggestionCommentRepository;
