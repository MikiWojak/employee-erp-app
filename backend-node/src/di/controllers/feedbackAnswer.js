module.exports = {
    services: {
        'controllers.feedbackAnswers.store': {
            class: 'controllers/FeedbackAnswers/StoreController',
            arguments: [
                '@repositories.feedbackToken',
                '@services.feedback.answer'
            ]
        },

        'controllers.feedbackAnswers.checkToken': {
            class: 'controllers/FeedbackAnswers/CheckTokenController',
            arguments: ['@repositories.feedbackToken']
        }
    }
};
