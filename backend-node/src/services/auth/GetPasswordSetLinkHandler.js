const dayjs = require('dayjs');
const crypto = require('crypto');
const { Op } = require('sequelize');

class GetPasswordSetLinkHandler {
    constructor(frontendUrl, passwordResetRepository) {
        this.frontendUrl = frontendUrl;
        this.passwordResetRepository = passwordResetRepository;
    }

    async handle(userId) {
        let passwordReset = null;

        const transaction =
            await this.passwordResetRepository.getDbTransaction();

        try {
            const now = dayjs().format();

            await this.passwordResetRepository.update(
                {
                    expiresAt: now
                },
                {
                    where: {
                        userId,
                        expiresAt: {
                            [Op.gte]: now
                        }
                    },
                    transaction
                }
            );

            passwordReset = await this.passwordResetRepository.create(
                {
                    userId,
                    token: crypto.randomBytes(64).toString('hex'),
                    expiresAt: dayjs().add(3, 'hour').format()
                },
                { transaction }
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        if (passwordReset) {
            return `${this.frontendUrl}/set-password?token=${passwordReset.token}`;
        }

        return null;
    }
}

module.exports = GetPasswordSetLinkHandler;
