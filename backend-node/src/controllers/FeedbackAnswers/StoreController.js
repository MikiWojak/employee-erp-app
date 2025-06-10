const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(feedbackTokenRepository, answerHandler) {
        this.feedbackTokenRepository = feedbackTokenRepository;
        this.answerHandler = answerHandler;
    }

    async invoke(req, res) {
        const { body, loggedUser } = req;

        const token = await this.feedbackTokenRepository.validate(
            loggedUser.id
        );

        if (!token) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        const transaction =
            await this.feedbackTokenRepository.getDbTransaction();

        try {
            this.answerHandler.handle(
                { token, user: loggedUser, answers: body },
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

module.exports = StoreController;
