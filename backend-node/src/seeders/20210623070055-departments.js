'use strict';

const faker = require('faker');

const di = require('../di');

const departmentRepository = di.get('repositories.department');

module.exports = {
    up: async () => {
        await departmentRepository.bulkCreate([
            { name: faker.commerce.department() },
            { name: faker.commerce.department() },
            { name: faker.commerce.department() }
        ]);
    },

    down: () => {}
};
