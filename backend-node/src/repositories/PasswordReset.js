const dayjs = require('dayjs');
const deepmerge = require('deepmerge');
const { Op } = require('sequelize');
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

        const dateTimeNow = dayjs().utc().format();

        return this.findByToken(token, {
            where: {
                expiresAt: {
                    [Op.gte]: dateTimeNow
                }
            },
            include: [
                {
                    association: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    required: true
                }
            ]
        });
    }
}

module.exports = PasswordResetRepository;
