module.exports = {
    services: {
        'controllers.feedbackAnswers.store': {
            class: 'controllers/FeedbackAnswers/StoreController',
            arguments: [
                '@repositories.feedbackQuestion',
                '@repositories.feedbackAnswer',
                '@repositories.feedbackToken'
            ]
        }
    }
};
