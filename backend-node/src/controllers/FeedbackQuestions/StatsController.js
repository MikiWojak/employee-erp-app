const { fn, col } = require('sequelize');

const { Role } = require('../../models');

class StatsController {
    constructor(feedbackQuestionRepository, feedbackAnswerRepository) {
        this.feedbackQuestionRepository = feedbackQuestionRepository;
        this.feedbackAnswerRepository = feedbackAnswerRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            rolesInfo: { isAdmin },
            query: {
                role = null,
                departmentId = null,
                feedbackTokensCollectionId = null
            }
        } = req;

        const whereDepartmentId =
            departmentId || !isAdmin
                ? {
                      departmentId: isAdmin
                          ? departmentId
                          : loggedUser.departmentId
                  }
                : {};

        const where = {
            ...whereDepartmentId,
            ...(feedbackTokensCollectionId && { feedbackTokensCollectionId })
        };

        const include =
            role || !isAdmin
                ? [
                      {
                          association: 'role',
                          attributes: [],
                          where: { name: isAdmin ? role : Role.EMPLOYEE }
                      }
                  ]
                : [];

        const questions = await this.feedbackQuestionRepository.findAll({
            order: [['order', 'ASC']],
            raw: true
        });

        const stats = await this.feedbackAnswerRepository.findAll({
            where,
            attributes: [
                'questionId',
                'answer',
                [fn('COUNT', col('answer')), 'answersCount']
            ],
            group: ['questionId', 'answer'],
            include,
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
