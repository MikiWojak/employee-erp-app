'use strict';

const { Role } = require('../models');
const di = require('../di');

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
