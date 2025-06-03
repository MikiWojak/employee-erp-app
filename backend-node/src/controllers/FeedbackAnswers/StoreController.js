const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(feedbackQuestionRepository, feedbackAnswerRepository) {
        this.feedbackQuestionRepository = feedbackQuestionRepository;
        this.feedbackAnswerRepository = feedbackAnswerRepository;
    }

    async invoke(req, res) {
        const { body, loggedUser } = req;

        for (const key in body) {
            const question =
                await this.feedbackQuestionRepository.findById(key);

            if (!question) {
                continue;
            }

            await this.feedbackAnswerRepository.create({
                roleId: loggedUser.roleId,
                departmentId: loggedUser.departmentId,
                answer: body[key]
            });
        }

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = StoreController;
