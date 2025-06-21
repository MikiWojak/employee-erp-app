const AbstractRepository = require('./AbstractRepository');

class SuggestionRepository extends AbstractRepository {
    get model() {
        return this.db.Suggestion;
    }
}

module.exports = SuggestionRepository;
