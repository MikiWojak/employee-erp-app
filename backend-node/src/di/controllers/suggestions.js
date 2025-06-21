module.exports = {
    services: {
        'controllers.suggestions.index': {
            class: 'controllers/Suggestions/IndexController',
            arguments: ['@repositories.suggestion']
        },

        'controllers.suggestions.store': {
            class: 'controllers/Suggestions/StoreController',
            arguments: ['@repositories.suggestion']
        },

        'controllers.suggestions.update': {
            class: 'controllers/Suggestions/UpdateController',
            arguments: ['@repositories.suggestion']
        },

        'controllers.suggestions.destroy': {
            class: 'controllers/Suggestions/DestroyController',
            arguments: ['@repositories.suggestion']
        },

        'controllers.suggestions.vote': {
            class: 'controllers/Suggestions/VoteController',
            arguments: [
                '@repositories.suggestion',
                '@repositories.suggestionVote2User'
            ]
        },

        'controllers.suggestions.status': {
            class: 'controllers/Suggestions/StatusController',
            arguments: ['@repositories.suggestion']
        }
    }
};
