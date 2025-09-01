const config = require('../../config');

module.exports = {
    parameters: {
        config,
        frontendUrl: config.app.frontendUrl
    },
    services: {
        sequelize: {
            arguments: ['%sequelize', '%config%'],
            factory: {
                class: 'services/factories/SequelizeFactory',
                method: 'create'
            }
        },

        redisSessionClient: {
            arguments: [],
            factory: {
                class: 'services/factories/RedisSessionClientFactory',
                method: 'create'
            }
        },

        'services.checkIfUserLoggedIn': {
            class: 'services/CheckIfUserLoggedInHandler',
            arguments: ['@repositories.user']
        },

        'services.sendEmail': {
            class: 'services/SendEmailHandler',
            arguments: ['@queues.producer.email', '@factories.email']
        },

        'services.auth.getPasswordSetLink': {
            class: 'services/auth/GetPasswordSetLinkHandler',
            arguments: ['%frontendUrl%', '@repositories.passwordReset']
        },

        'services.media.store': {
            class: 'services/media/StoreHandler',
            arguments: ['@repositories.media']
        },

        'services.media.delete': {
            class: 'services/media/DeleteHandler',
            arguments: ['@repositories.media']
        },

        'services.feedback.generateTokenCollection': {
            class: 'services/feedback/GenerateTokenCollectionHandler',
            arguments: [
                '@repositories.feedbackTokensCollection',
                '@repositories.feedbackToken',
                '@repositories.user'
            ]
        },

        'services.feedback.answer': {
            class: 'services/feedback/AnswerHandler',
            arguments: [
                '@repositories.feedbackAnswer',
                '@repositories.feedbackTokensCollection'
            ]
        }
    }
};
