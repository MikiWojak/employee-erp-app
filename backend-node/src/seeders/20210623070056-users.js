'use strict';
const { Role } = require('../models');

const di = require('../di');
const roleRepository = di.get('repositories.role');
const userRepository = di.get('repositories.user');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Admin
        const { id: adminId } = await roleRepository.findByName(Role.ADMIN);

        await userRepository.create({
            roleId: adminId,
            firstName: 'John',
            lastName: 'Admin',
            dateOfBirth: '1985-03-17',

            email: 'admin@erp.test',
            password: 'Qwerty123!'
        });

        // Employee
        const { id: employeeId } = await roleRepository.findByName(
            Role.EMPLOYEE
        );

        await userRepository.create({
            roleId: employeeId,
            firstName: 'George',
            lastName: 'Employee',
            dateOfBirth: '1990-09-03',

            email: 'employee@erp.test',
            password: 'Qwerty123!'
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
