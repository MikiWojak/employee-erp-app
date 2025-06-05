const { body } = require('express-validator');

const includesAll = require('../helpers/includesAll');

const submit = [
    body()
        .isObject()
        .withMessage('The form must be an object')
        .custom(async (value, { req: { app } }) => {
            if (!Object.keys(value).length) {
                return Promise.reject('No empty object.');
            }

            const di = app.get('di');
            const feedbackQuestionRepository = di.get(
                'repositories.feedbackQuestion'
            );

            const questions = await feedbackQuestionRepository.findAll();
            const questionIdsDb = questions.map(question => question.id);

            const areAllQuestionsFilled = includesAll(
                Object.keys(value),
                questionIdsDb
            );

            if (!areAllQuestionsFilled) {
                return Promise.reject('Not all questions are filled.');
            }

            for (const questionId in value) {
                const question = questions.find(
                    question => question.id === questionId
                );

                if (!question) {
                    return Promise.reject('Question not found.');
                }

                if (!value[questionId]?.trim()) {
                    return Promise.reject('Missing value.');
                }

                if (!question.answerOptions.includes(value[questionId])) {
                    return Promise.reject('Invalid value.');
                }
            }

            return Promise.resolve();
        })
];

module.exports = {
    submit
};
