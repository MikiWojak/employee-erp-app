module.exports = {
    services: {
        'controllers.feedbackQuestions.index': {
            class: 'controllers/FeedbackQuestions/IndexController',
            arguments: ['@repositories.feedbackQuestion']
        },

        'controllers.feedbackQuestions.stats': {
            class: 'controllers/FeedbackQuestions/StatsController',
            arguments: [
                '@repositories.feedbackQuestion',
                '@repositories.feedbackAnswer'
            ]
        }
    }
};
