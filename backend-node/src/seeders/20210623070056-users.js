'use strict';

const faker = require('faker');

const di = require('../di');
const { Role } = require('../models');
const getRandomDateOfBirth = require('../helpers/getRandomDateOfBirth');

const roleRepository = di.get('repositories.role');
const userRepository = di.get('repositories.user');
const departmentRepository = di.get('repositories.department');

module.exports = {
    up: async () => {
        const [departments, roleAdmin, roleManager, roleEmployee] =
            await Promise.all([
                departmentRepository.findAll(),
                roleRepository.findByName(Role.ADMIN),
                roleRepository.findByName(Role.MANAGER),
                roleRepository.findByName(Role.EMPLOYEE)
            ]);

        const [admin, manager, employee] = await Promise.all([
            userRepository.create({
                firstName: faker.name.firstName(),
                lastName: 'Admin',
                dateOfBirth: getRandomDateOfBirth(),
                email: 'admin@erp.test',
                password: 'Qwerty123!'
            }),
            userRepository.create({
                firstName: faker.name.firstName(),
                lastName: 'Manager',
                dateOfBirth: getRandomDateOfBirth(),
                email: 'manager@erp.test',
                password: 'Qwerty123!'
            }),
            userRepository.create({
                firstName: faker.name.firstName(),
                lastName: 'Employee',
                dateOfBirth: getRandomDateOfBirth(),
                email: 'employee@erp.test',
                password: 'Qwerty123!'
            })
        ]);

        const department = faker.random.arrayElement(departments);

        await Promise.all([
            admin.setRoles([roleAdmin]),
            manager.setRoles([roleManager]),
            employee.setRoles([roleEmployee]),
            department.setUsers([manager, employee])
        ]);
    },

    down: () => {}
};
