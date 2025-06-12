class AnswerHandler {
    constructor(feedbackAnswerRepository, feedbackTokensCollectionRepository) {
        this.feedbackAnswerRepository = feedbackAnswerRepository;
        this.feedbackTokensCollectionRepository =
            feedbackTokensCollectionRepository;
    }

    async handle({ token, user, answers }, options = {}) {
        for (const questionId in answers) {
            await this.feedbackAnswerRepository.create(
                {
                    feedbackTokensCollectionId:
                        token.feedbackTokensCollectionId,
                    roleId: user.roleId,
                    departmentId: user.departmentId,
                    questionId,
                    answer: answers[questionId]
                },
                options
            );
        }

        await token.update({ filled: true }, options);

        const tokenCollection =
            await this.feedbackTokensCollectionRepository.findById(
                token.feedbackTokensCollectionId,
                options
            );

        await tokenCollection.increment(
            { usersFilled: 1 },
            {
                silent: true,
                ...options
            }
        );
    }
}

module.exports = AnswerHandler;
