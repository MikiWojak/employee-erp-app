'use strict';

const { Role } = require('../models');

const di = require('../di');
const roleRepository = di.get('repositories.role');

module.exports = {
    up: async () => {
        await roleRepository.create({
            name: Role.ADMIN
        });

        await roleRepository.create({
            name: Role.EMPLOYEE
        });
    },

    down: async queryInterface => {
        await queryInterface.bulkDelete('Roles', null, {});
    }
};
