module.exports = {
    services: {
        'controllers.suggestionComments.index': {
            class: 'controllers/SuggestionComments/IndexController',
            arguments: ['@repositories.suggestionComment']
        }
    }
};
