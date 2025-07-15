const dayjs = require('dayjs');
const { Op } = require('sequelize');
const deepmerge = require('deepmerge');

const AbstractRepository = require('./AbstractRepository');

class FeedbackTokenRepository extends AbstractRepository {
    get model() {
        return this.db.FeedbackToken;
    }

    validate(userId, options = {}) {
        if (!userId?.trim()) {
            return null;
        }

        const args = deepmerge(options, {
            where: { userId, filled: false },
            include: [
                {
                    association: 'tokensCollection',
                    attributes: [],
                    required: true,
                    where: {
                        [Op.or]: [
                            { expiresAt: null },
                            { expiresAt: { [Op.gte]: dayjs().format() } }
                        ]
                    }
                }
            ]
        });

        return this.findOne(args);
    }
}

module.exports = FeedbackTokenRepository;
