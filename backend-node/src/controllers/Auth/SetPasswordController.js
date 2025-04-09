const dayjs = require('dayjs');
const { StatusCodes: HTTP } = require('http-status-codes');

class SetPasswordController {
    constructor(userRepository, passwordResetRepository) {
        this.userRepository = userRepository;
        this.passwordResetRepository = passwordResetRepository;
    }

    async invoke(req, res) {
        const {
            body: { token, password }
        } = req;

        const passwordReset =
            await this.passwordResetRepository.findByToken(token);

        if (!passwordReset) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        // @TODO Check UTC Time
        const tokenExpiresAt = dayjs(passwordReset.expiresAt).format();
        const dateTimeNow = dayjs().format();

        // @TODO Remove after debug
        console.log({
            expiresAt: passwordReset.expiresAt,
            tokenExpiresAt,
            dateTimeNow,
            expiresAtType: typeof passwordReset.expiresAt,
            tokenExpiresAtType: typeof tokenExpiresAt,
            dateTimeNowType: typeof dateTimeNow
        });

        if (tokenExpiresAt < dateTimeNow) {
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
                { expiresAt: dateTimeNow },
                { transaction }
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = SetPasswordController;
