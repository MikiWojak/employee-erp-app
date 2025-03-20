'use strict';

const { Role } = require('../models');

const di = require('../di');
const roleRepository = di.get('repositories.role');
const userRepository = di.get('repositories.user');

module.exports = {
    up: async () => {
        const roleAdmin = await roleRepository.findByName(Role.ADMIN);

        const admin = await userRepository.create({
            firstName: 'John',
            lastName: 'Admin',
            dateOfBirth: '1985-03-17',

            email: 'admin@erp.test',
            password: 'Qwerty123!'
        });

        await admin.setRoles([roleAdmin]);

        const roleEmployee = await roleRepository.findByName(Role.EMPLOYEE);

        const employee = await userRepository.create({
            firstName: 'George',
            lastName: 'Employee',
            dateOfBirth: '1990-09-03',

            email: 'employee@erp.test',
            password: 'Qwerty123!'
        });

        await employee.setRoles([roleEmployee]);
    },

    down: async queryInterface => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
