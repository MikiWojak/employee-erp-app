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

        'services.sendEmail': {
            class: 'services/SendEmailHandler',
            arguments: ['@queues.producer.email', '@factories.email']
        },

        'services.getLoggedInUserHandler': {
            class: 'services/GetLoggedInUserHandler',
            arguments: ['@repositories.user']
        },

        'queues.connection': {
            arguments: ['%amqplib', '%rabbitmqConfig%'],
            factory: {
                class: 'services/factories/queues/ConnectionFactory',
                method: 'create'
            }
        },

        'queues.channel': {
            arguments: ['@queues.connection'],
            factory: {
                class: 'services/factories/queues/ChannelFactory',
                method: 'create'
            }
        },

        'queues.producer.email': {
            class: 'services/queues/Producer',
            arguments: ['@queues.channel', '%queues.email%']
        },

        'queues.consumer.email': {
            class: 'services/queues/consumers/EmailConsumer',
            arguments: ['%queues.email%', '%emailConfig%']
        }
    }
};
