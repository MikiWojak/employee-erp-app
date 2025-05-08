'use strict';

const faker = require('faker');

const di = require('../di');

const departmentRepository = di.get('repositories.department');

module.exports = {
    up: async () => {
        for (let i = 0; i < 5; i++) {
            await departmentRepository.create({
                name: faker.commerce.department()
            });
        }
    },

    down: () => {}
};
