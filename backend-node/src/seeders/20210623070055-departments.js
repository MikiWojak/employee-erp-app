'use strict';

const di = require('../di');
const faker = require('faker');
const departmentRepository = di.get('repositories.department');

module.exports = {
    up: async () => {
        for (let i = 0; i < 3; i++) {
            await departmentRepository.create({
                name: faker.commerce.department()
            });
        }
    },

    down: async queryInterface => {
        return queryInterface.bulkDelete('Departments', null, {});
    }
};
