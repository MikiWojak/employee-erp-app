module.exports = {
    services: {
        'controllers.feedbackTokensCollections.index': {
            class: 'controllers/FeedbackTokensCollections/IndexController',
            arguments: ['@repositories.feedbackTokensCollection']
        },

        'controllers.feedbackTokensCollections.store': {
            class: 'controllers/FeedbackTokensCollections/IndexController',
            arguments: [
                '@repositories.feedbackTokensCollection',
                '@repositories.feedbackToken',
                '@repositories.user'
            ]
        }
    }
};
