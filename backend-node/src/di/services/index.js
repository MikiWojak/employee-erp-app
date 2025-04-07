const config = require('../../config');

module.exports = {
    parameters: {
        config
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

        'services.getLoggedInUserHandler': {
            class: 'services/GetLoggedInUserHandler',
            arguments: ['@repositories.user']
        },

        'services.sendEmail': {
            class: 'services/SendEmailHandler',
            arguments: ['@queues.producer.email', '@factories.email']
        }
    }
};
