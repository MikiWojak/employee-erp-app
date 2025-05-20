'use strict';

const faker = require('faker');

const di = require('../di');

const departmentRepository = di.get('repositories.department');

module.exports = {
    up: async () => {
        const departmentNames = new Set();

        // @TODO TMP changed
        for (let i = 0; i < 2; i++) {
            departmentNames.add(faker.lorem.words());
        }

        await departmentRepository.bulkCreate(
            [...departmentNames].map(name => ({ name }))
        );
    },

    down: () => {}
};
