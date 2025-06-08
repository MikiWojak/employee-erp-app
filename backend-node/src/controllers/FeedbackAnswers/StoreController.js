const dayjs = require('dayjs');
const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(
        feedbackQuestionRepository,
        feedbackAnswerRepository,
        feedbackTokenRepository
    ) {
        this.feedbackQuestionRepository = feedbackQuestionRepository;
        this.feedbackAnswerRepository = feedbackAnswerRepository;
        this.feedbackTokenRepository = feedbackTokenRepository;
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
                        feedbackTokensCollectionId:
                            token.feedbackTokensCollectionId,
                        roleId: loggedUser.roleId,
                        departmentId: loggedUser.departmentId,
                        questionId,
                        answer: body[questionId]
                    },
                    { transaction }
                );
            }

            await token.update({ expired: true }, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = StoreController;
