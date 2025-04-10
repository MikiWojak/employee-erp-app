const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { StatusCodes: HTTP } = require('http-status-codes');

dayjs.extend(utc);

class SetPasswordController {
    constructor(userRepository, passwordResetRepository, sendEmailHandler) {
        this.userRepository = userRepository;
        this.passwordResetRepository = passwordResetRepository;
        this.sendEmailHandler = sendEmailHandler;
    }

    async invoke(req, res) {
        const {
            body: { token, password }
        } = req;

        const passwordReset =
            await this.passwordResetRepository.validateToken(token);

        if (!passwordReset) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        const user = await this.userRepository.findById(passwordReset.userId);

        if (!user) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        const transaction = await this.userRepository.getDbTransaction();

        try {
            await user.update({ password }, { transaction });

            await passwordReset.update(
                { expiresAt: dayjs().utc().format() },
                { transaction }
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        await this.sendEmailHandler.handle('PasswordChanged', user.email, {
            firstName: user.firstName
        });

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = SetPasswordController;
