module.exports = {
    services: {
        'controllers.suggestions.index': {
            class: 'controllers/Suggestions/IndexController',
            arguments: ['@repositories.suggestion']
        },

        'controllers.suggestions.store': {
            class: 'controllers/Suggestions/StoreController',
            arguments: ['@repositories.suggestion']
        }
    }
};
