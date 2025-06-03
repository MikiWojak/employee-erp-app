module.exports = {
    services: {
        'controllers.feedbackAnswers.stats': {
            class: 'controllers/FeedbackAnswers/StatsController',
            arguments: [
                '@repositories.feedbackQuestion',
                '@repositories.feedbackAnswer'
            ]
        },

        'controllers.feedbackAnswers.store': {
            class: 'controllers/FeedbackAnswers/StoreController',
            arguments: [
                '@repositories.feedbackQuestion',
                '@repositories.feedbackAnswer'
            ]
        }
    }
};
