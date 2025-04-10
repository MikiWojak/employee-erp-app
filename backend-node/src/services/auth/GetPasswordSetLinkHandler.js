const dayjs = require('dayjs');
const crypto = require('crypto');

class GetPasswordSetLinkHandler {
    constructor(frontendUrl, passwordResetRepository) {
        this.frontendUrl = frontendUrl;
        this.passwordResetRepository = passwordResetRepository;
    }

    async handle(userId) {
        const passwordReset = await this.passwordResetRepository.create({
            userId,
            token: crypto.randomBytes(64).toString('hex'),
            expiresAt: dayjs().add(3, 'hour').format()
        });

        if (!passwordReset) {
            return null;
        }

        return `${this.frontendUrl}/set-password?token=${passwordReset.token}`;
    }
}

module.exports = GetPasswordSetLinkHandler;
