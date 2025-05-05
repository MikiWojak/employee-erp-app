'use strict';

const { Role } = require('../models');

const di = require('../di');
const roleRepository = di.get('repositories.role');

module.exports = {
    up: async () => {
        await Promise.all([
            roleRepository.create({ name: Role.ADMIN }),
            roleRepository.create({ name: Role.MANAGER }),
            roleRepository.create({ name: Role.EMPLOYEE })
        ]);
    },

    down: async queryInterface => {
        await queryInterface.bulkDelete('Roles', null, {});
    }
};
