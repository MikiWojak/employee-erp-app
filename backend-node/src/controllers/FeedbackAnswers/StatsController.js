const { fn, col } = require('sequelize');
const { StatusCodes: HTTP } = require('http-status-codes');

class StatsController {
    constructor(feedbackQuestionRepository, feedbackAnswerRepository) {
        this.feedbackQuestionRepository = feedbackQuestionRepository;
        this.feedbackAnswerRepository = feedbackAnswerRepository;
    }

    async invoke(req, res) {
        const stats = await this.feedbackAnswerRepository.findAll({
            attributes: ['questionId', 'answer', fn('COUNT', col('answer'))],
            group: ['questionId', 'answer'],
            raw: true
        });

        return res.send(stats);
    }
}

module.exports = StatsController;
