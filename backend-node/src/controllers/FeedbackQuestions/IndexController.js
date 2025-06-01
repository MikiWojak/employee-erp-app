class IndexController {
    constructor(feedbackQuestionRepository) {
        this.feedbackQuestionRepository = feedbackQuestionRepository;
    }

    async invoke(req, res) {
        const questions =
            await this.feedbackQuestionRepository.findAndCountAll();

        return res.send(questions);
    }
}

module.exports = IndexController;
