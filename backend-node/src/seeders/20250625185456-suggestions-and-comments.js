'use strict';

const faker = require('faker');

const {
    Role: { EMPLOYEE, MANAGER }
} = require('../models');

const di = require('../di');
const userRepository = di.get('repositories.user');
const suggestionRepository = di.get('repositories.suggestion');

module.exports = {
    up: async () => {
        const { STATUS_ACCEPTED } = suggestionRepository.model;

        const users = await userRepository.findAll({
            include: [
                {
                    association: 'role',
                    required: true,
                    where: { name: [EMPLOYEE, MANAGER] }
                }
            ]
        });

        // @TODO More sophisticated
        // @TODO Longer "description"
        await suggestionRepository.bulkCreate([
            {
                userId: faker.random.arrayElement(users).id,
                title: faker.lorem.words(),
                description: faker.lorem.paragraphs(),
                status: STATUS_ACCEPTED
            },
            {
                userId: faker.random.arrayElement(users).id,
                title: faker.lorem.words(),
                description: faker.lorem.paragraphs(),
                status: STATUS_ACCEPTED
            },
            {
                userId: faker.random.arrayElement(users).id,
                title: faker.lorem.words(),
                description: faker.lorem.paragraphs(),
                status: STATUS_ACCEPTED
            }
        ]);

        // @TODO Comments
    },

    down: () => {}
};
