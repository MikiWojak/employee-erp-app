const config = require('../../config');

module.exports = {
    parameters: {
        config,
        emailConfig: config.email,
        rabbitmqConfig: config.rabbitmq,
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

        'services.sendEmail': {
            class: 'services/SendEmailHandler',
            arguments: ['@queues.producer.email']
        },

        'services.getLoggedInUserHandler': {
            class: 'services/GetLoggedInUserHandler',
            arguments: ['@repositories.user']
        },

        'queues.producer.email': {
            class: 'services/queues/Producer',
            arguments: ['%rabbitmqConfig%', '%queues.email%']
        },

        'queues.consumer.email': {
            class: 'services/queues/consumers/EmailConsumer',
            arguments: ['%queues.email%', '%emailConfig%']
        }
    }
};
