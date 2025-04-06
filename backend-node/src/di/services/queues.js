const config = require('../../config');

module.exports = {
    parameters: {
        config,
        emailConfig: config.email,
        rabbitmqConfig: config.rabbitmq,
        'queues.email': config.queues.email
    },
    services: {
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
