const { StatusCodes: HTTP } = require('http-status-codes');

class SendResetPasswordLinkController {
    constructor(userRepository, sendEmailHandler, getPasswordSetLinkHandler) {
        this.userRepository = userRepository;
        this.sendEmailHandler = sendEmailHandler;
        this.getPasswordSetLinkHandler = getPasswordSetLinkHandler;
    }

    async invoke(req, res) {
        const {
            body: { email }
        } = req;

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        const resetPasswordLink = await this.getPasswordSetLinkHandler.handle(
            user.id
        );

        await this.sendEmailHandler.handle('PasswordReset', email, {
            firstName: user.firstName,
            resetPasswordLink
        });

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = SendResetPasswordLinkController;
