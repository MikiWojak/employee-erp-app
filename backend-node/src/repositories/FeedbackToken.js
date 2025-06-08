const AbstractRepository = require('./AbstractRepository');
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const deepmerge = require('deepmerge');

class FeedbackTokenRepository extends AbstractRepository {
    get model() {
        return this.db.FeedbackToken;
    }

    validate(userId, options = {}) {
        if (!userId?.trim()) {
            return null;
        }

        const args = deepmerge(options, { where: { userId, expiresAt: null } });

        return this.findOne(args);
    }
}

module.exports = FeedbackTokenRepository;
