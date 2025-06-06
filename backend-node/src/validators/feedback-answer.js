const { body } = require('express-validator');

const includesAll = require('../helpers/includesAll');

const submit = [
    body()
        .isObject()
        .withMessage('The form must be an object')
        .custom(async (value, { req: { app } }) => {
            if (!Object.keys(value).length) {
                return Promise.reject('All the questions must be filled.');
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
                return Promise.reject('All the questions must be filled.');
            }

            for (const questionId in value) {
                const question = questions.find(
                    question => question.id === questionId
                );

                if (!question) {
                    return Promise.reject(
                        'At least one question does not exist in the system.'
                    );
                }

                if (!value[questionId]?.trim()) {
                    return Promise.reject('All the questions must be filled.');
                }

                if (!question.answerOptions.includes(value[questionId])) {
                    return Promise.reject(
                        'At least one question has invalid answer.'
                    );
                }
            }

            return Promise.resolve();
        })
];

module.exports = {
    submit
};
