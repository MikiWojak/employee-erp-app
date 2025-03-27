const config = require('../../config');

module.exports = {
    parameters: {
        config,
        email: config.email,
        rabbitmq: config.rabbitmq,
        'queues.email': config.queues.email
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
            arguments: ['%email%', '@queues.producer.email']
        },

        'services.getLoggedInUserHandler': {
            class: 'services/GetLoggedInUserHandler',
            arguments: ['@repositories.user']
        },

        // @TODO Consider parsing connect / channel like `sequelize`
        'queues.producer.email': {
            class: 'services/queues/Producer',
            arguments: ['%rabbitmq%', '%queues.email%']
        },

        'queues.consumer.email': {
            class: 'services/queues/consumers/EmailConsumer',
            arguments: ['%queues.email%']
        }
    }
};
