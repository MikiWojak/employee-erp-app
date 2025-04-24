const { StatusCodes: HTTP } = require('http-status-codes');

class CheckSetPasswordTokenController {
    constructor(passwordResetRepository) {
        this.passwordResetRepository = passwordResetRepository;
    }

    async invoke(req, res) {
        const {
            body: { token }
        } = req;

        const passwordReset =
            await this.passwordResetRepository.validateToken(token);

        if (!passwordReset) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = CheckSetPasswordTokenController;
