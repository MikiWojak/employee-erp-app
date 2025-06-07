const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(feedbackQuestionRepository, feedbackAnswerRepository) {
        this.feedbackQuestionRepository = feedbackQuestionRepository;
        this.feedbackAnswerRepository = feedbackAnswerRepository;
    }

    async invoke(req, res) {
        const { body, loggedUser } = req;

        const transaction =
            await this.feedbackAnswerRepository.getDbTransaction();

        try {
            for (const questionId in body) {
                const question =
                    await this.feedbackQuestionRepository.findById(questionId);

                if (!question) {
                    throw new Error(`Question ${questionId} not found!`);
                }

                await this.feedbackAnswerRepository.create(
                    {
                        roleId: loggedUser.roleId,
                        departmentId: loggedUser.departmentId,
                        questionId,
                        answer: body[questionId]
                    },
                    { transaction }
                );
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = StoreController;
