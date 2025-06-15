const AbstractRepository = require('./AbstractRepository');

class SuggestionVote2UserRepository extends AbstractRepository {
    get model() {
        return this.db.SuggestionVote2User;
    }
}

module.exports = SuggestionVote2UserRepository;
