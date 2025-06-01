module.exports = {
    services: {
        'controllers.feedbackQuestions.index': {
            class: 'controllers/FeedbackQuestions/IndexController',
            arguments: ['@repositories.feedbackQuestion']
        }
    }
};
