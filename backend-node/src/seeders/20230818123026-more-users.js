'use strict';

const dayjs = require('dayjs');
const faker = require('faker');

const { Role } = require('../models');

const di = require('../di');
const roleRepository = di.get('repositories.role');
const userRepository = di.get('repositories.user');

const getDateOfBirth = () =>
    dayjs(
        faker.date.between(
            dayjs().subtract(65, 'year').format('YYYY-MM-DD'),
            dayjs().subtract(18, 'year').format('YYYY-MM-DD')
        )
    ).format('YYYY-MM-DD');

module.exports = {
    up: async () => {
        const [roleManager, roleEmployee] = await Promise.all([
            roleRepository.findByName(Role.MANAGER),
            roleRepository.findByName(Role.EMPLOYEE)
        ]);

        const managersCount = Math.floor(Math.random() * 2) + 2;

        for (let i = 0; i < managersCount; i++) {
            const manager = await userRepository.create({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                dateOfBirth: getDateOfBirth(),
                email: faker.internet.email().toLowerCase(),
                password: 'Qwerty123!'
            });

            await manager.setRoles([roleManager]);

            const employeesPerManagerCount = Math.floor(Math.random() * 3) + 3;

            for (let j = 0; j < employeesPerManagerCount; j++) {
                const employee = await userRepository.create({
                    managerId: manager.id,
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    dateOfBirth: getDateOfBirth(),
                    email: faker.internet.email().toLowerCase(),
                    password: 'Qwerty123!'
                });

                await employee.setRoles([roleEmployee]);
            }
        }
    },

    down: async queryInterface => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
