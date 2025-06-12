const { StatusCodes: HTTP } = require('http-status-codes');

class IndexController {
    constructor(feedbackTokenRepository) {
        this.feedbackTokenRepository = feedbackTokenRepository;
    }

    async invoke(req, res) {
        const { loggedUser } = req;

        const token = await this.feedbackTokenRepository.validate(
            loggedUser.id
        );

        if (!token) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = IndexController;
