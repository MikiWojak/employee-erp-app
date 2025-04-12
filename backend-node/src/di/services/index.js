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

        'services.getLoggedInUser': {
            class: 'services/GetLoggedInUserHandler',
            arguments: ['@repositories.user']
        },

        'services.sendEmail': {
            class: 'services/SendEmailHandler',
            arguments: ['@queues.producer.email', '@factories.email']
        },

        'services.auth.getPasswordSetLink': {
            class: 'services/auth/GetPasswordSetLinkHandler',
            arguments: ['%frontendUrl%', '@repositories.passwordReset']
        }
    }
};
