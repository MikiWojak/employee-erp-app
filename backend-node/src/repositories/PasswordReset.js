const dayjs = require('dayjs');
const { Op } = require('sequelize');
const deepmerge = require('deepmerge');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

const AbstractRepository = require('./AbstractRepository');

class PasswordResetRepository extends AbstractRepository {
    get model() {
        return this.db.PasswordReset;
    }

    findByToken(token, options = {}) {
        const args = deepmerge(options, { where: { token } });

        return this.model.findOne(args);
    }

    validateToken(token) {
        if (!token?.trim()) {
            return null;
        }

        return this.findByToken(token, {
            where: {
                expiresAt: {
                    [Op.gte]: dayjs().utc().format()
                }
            },
            include: [
                {
                    association: 'user',
                    attributes: ['id'],
                    required: true
                }
            ]
        });
    }
}

module.exports = PasswordResetRepository;
