'use strict';

const faker = require('faker');

const { Role } = require('../models');
const getRandomDateOfBirth = require('../helpers/getRandomDateOfBirth');

const di = require('../di');
const roleRepository = di.get('repositories.role');
const userRepository = di.get('repositories.user');
const departmentRepository = di.get('repositories.department');

module.exports = {
    up: async () => {
        const [departments, roleManager, roleEmployee] = await Promise.all([
            departmentRepository.findAll(),
            roleRepository.findByName(Role.MANAGER),
            roleRepository.findByName(Role.EMPLOYEE)
        ]);

        const managersCount = Math.floor(Math.random() * 2) + 2;

        for (let i = 0; i < managersCount; i++) {
            const department = faker.random.arrayElement(departments);

            const manager = await userRepository.create({
                roleId: roleManager.id,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                dateOfBirth: getRandomDateOfBirth(),
                email: faker.internet.email().toLowerCase(),
                password: 'Qwerty123!'
            });

            await manager.setDepartment(department);

            const employeesPerManagerCount = Math.floor(Math.random() * 5) + 3;

            for (let j = 0; j < employeesPerManagerCount; j++) {
                const employee = await userRepository.create({
                    roleId: roleEmployee.id,
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    dateOfBirth: getRandomDateOfBirth(),
                    email: faker.internet.email().toLowerCase(),
                    password: 'Qwerty123!'
                });

                await employee.setDepartment(department);
            }
        }
    },

    down: () => {}
};
