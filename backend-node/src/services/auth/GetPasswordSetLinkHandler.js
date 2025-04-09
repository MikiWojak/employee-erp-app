const dayjs = require('dayjs');
const crypto = require('crypto');

class GetPasswordSetLinkHandler {
    constructor(frontendUrl, userRepository, passwordResetRepository) {
        this.frontendUrl = frontendUrl;
        this.userRepository = userRepository;
        this.passwordResetRepository = passwordResetRepository;
    }

    async handle(userId) {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return null;
        }

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
