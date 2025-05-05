'use strict';

const { Role } = require('../models');

const di = require('../di');
const roleRepository = di.get('repositories.role');
const userRepository = di.get('repositories.user');

module.exports = {
    up: async () => {
        const [roleAdmin, roleManager, roleEmployee] = await Promise.all([
            roleRepository.findByName(Role.ADMIN),
            roleRepository.findByName(Role.MANAGER),
            roleRepository.findByName(Role.EMPLOYEE)
        ]);

        const [admin, manager] = await Promise.all([
            userRepository.create({
                firstName: 'John',
                lastName: 'Admin',
                dateOfBirth: '1985-03-17',
                email: 'admin@erp.test',
                password: 'Qwerty123!'
            }),
            userRepository.create({
                firstName: 'Frank',
                lastName: 'Manager',
                dateOfBirth: '1987-04-06',
                email: 'manager@erp.test',
                password: 'Qwerty123!'
            })
        ]);

        const employee = await userRepository.create({
            managerId: manager.id,
            firstName: 'George',
            lastName: 'Employee',
            dateOfBirth: '1990-09-03',
            email: 'employee@erp.test',
            password: 'Qwerty123!'
        });

        await Promise.all([
            admin.setRoles([roleAdmin]),
            manager.setRoles([roleManager]),
            employee.setRoles([roleEmployee])
        ]);
    },

    down: async queryInterface => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
