const config = require('../../config');

module.exports = {
    parameters: {
        config,
        email: config.email
    },
    services: {
        sequelize: {
            arguments: ['%sequelize', '%config%'],
            factory: {
                class: 'di/services/SequelizeFactory',
                method: 'create'
            }
        },

        redisSessionClient: {
            arguments: [],
            factory: {
                class: 'di/services/RedisSessionClientFactory',
                method: 'create'
            }
        },

        mailer: {
            class: 'services/Mailer',
            arguments: ['%email%']
        },

        'services.getLoggedInUserHandler': {
            class: 'services/GetLoggedInUserHandler',
            arguments: ['@repositories.user']
        }
    }
};
