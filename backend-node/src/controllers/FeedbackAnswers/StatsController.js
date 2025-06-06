const { fn, col } = require('sequelize');

class StatsController {
    constructor(feedbackQuestionRepository, feedbackAnswerRepository) {
        this.feedbackQuestionRepository = feedbackQuestionRepository;
        this.feedbackAnswerRepository = feedbackAnswerRepository;
    }

    async invoke(req, res) {
        const questions = await this.feedbackQuestionRepository.findAll({
            raw: true
        });

        const stats = await this.feedbackAnswerRepository.findAll({
            attributes: [
                'questionId',
                'answer',
                [fn('COUNT', col('answer')), 'answersCount']
            ],
            group: ['questionId', 'answer'],
            raw: true
        });

        const processedQuestions = [];

        for (const question of questions) {
            const rawData = stats.filter(
                stat => stat.questionId === question.id
            );

            const data = [];

            question.answerOptions.forEach(answerOption => {
                const dataItem = rawData.find(
                    item => item.answer === answerOption
                );

                if (dataItem) {
                    data.push(dataItem.answersCount);
                } else {
                    data.push(0);
                }
            });

            processedQuestions.push({
                ...question,
                data
            });
        }

        return res.send(processedQuestions);
    }
}

module.exports = StatsController;
