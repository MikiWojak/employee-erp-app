'use strict';

const di = require('../di');
const { Role } = require('../models');

const roleRepository = di.get('repositories.role');

module.exports = {
    up: async () => {
        await roleRepository.bulkCreate([
            { name: Role.ADMIN },
            { name: Role.EMPLOYEE }
        ]);
    },

    down: () => {}
};
