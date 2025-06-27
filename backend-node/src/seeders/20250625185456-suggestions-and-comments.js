'use strict';

const faker = require('faker');

const {
    Role: { EMPLOYEE, MANAGER }
} = require('../models');

const di = require('../di');
const userRepository = di.get('repositories.user');
const suggestionRepository = di.get('repositories.suggestion');
const suggestionCommentRepository = di.get('repositories.suggestionComment');

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

        const suggestionsCount = Math.floor(Math.random() * 5) + 3;

        for (let i = 0; i < suggestionsCount; i++) {
            await suggestionRepository.create({
                userId: faker.random.arrayElement(users).id,
                title: faker.lorem.words(),
                description: faker.lorem.paragraphs(),
                status: STATUS_ACCEPTED
            });
        }

        const suggestions = await suggestionRepository.findAll({});

        for (const suggestion of suggestions) {
            const commentsCount = Math.floor(Math.random() * 10) + 3;

            for (let j = 0; j < commentsCount; j++) {
                await suggestionCommentRepository.create({
                    suggestionId: suggestion.id,
                    userId: faker.random.arrayElement(users).id,
                    content: faker.lorem.paragraphs()
                });
            }
        }
    },

    down: () => {}
};
