module.exports = {
    services: {
        'controllers.suggestionComments.index': {
            class: 'controllers/SuggestionComments/IndexController',
            arguments: ['@repositories.suggestionComment']
        },

        'controllers.suggestionComments.store': {
            class: 'controllers/SuggestionComments/StoreController',
            arguments: [
                '@repositories.suggestion',
                '@repositories.suggestionComment'
            ]
        },

        'controllers.suggestionComments.update': {
            class: 'controllers/SuggestionComments/UpdateController',
            arguments: [
                '@repositories.suggestion',
                '@repositories.suggestionComment'
            ]
        },

        'controllers.suggestionComments.destroy': {
            class: 'controllers/SuggestionComments/DestroyController',
            arguments: [
                '@repositories.suggestion',
                '@repositories.suggestionComment'
            ]
        }
    }
};
