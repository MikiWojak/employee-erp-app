const AbstractRepository = require('./AbstractRepository');

class SuggestionVote2UserRepository extends AbstractRepository {
    get model() {
        return this.db.SuggestionVote2User;
    }

    getByPK({ suggestionId, userId }) {
        return this.findOne({ where: { suggestionId, userId } });
    }

    async createOrUpdate({ suggestionId, userId, vote }, options = {}) {
        const suggestion = await this.getByPK({ suggestionId, userId });

        if (!suggestion) {
            return this.create({ suggestionId, userId, vote }, options);
        }

        return suggestion.update({ vote }, options);
    }
}

module.exports = SuggestionVote2UserRepository;
