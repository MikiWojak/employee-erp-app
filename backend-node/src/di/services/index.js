const config = require('../../config');

module.exports = {
    parameters: {
        config
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
            arguments: [],
            factory: {
                class: 'di/services/Mailer',
                method: 'create'
            }
        },

        'services.getLoggedInUserHandler': {
            class: 'services/GetLoggedInUserHandler',
            arguments: ['@repositories.user']
        }
    }
};
