'use strict';

const dayjs = require('dayjs');
const faker = require('faker');

const { Role } = require('../models');

const di = require('../di');
const roleRepository = di.get('repositories.role');
const userRepository = di.get('repositories.user');
const departmentRepository = di.get('repositories.department');

module.exports = {
    up: async () => {
        const [departments, roleEmployee] = await Promise.all([
            departmentRepository.findAll(),
            roleRepository.findByName(Role.EMPLOYEE)
        ]);

        for (let i = 0; i < 20; i++) {
            const dateOfBirth = dayjs(
                faker.date.between(
                    dayjs().subtract(65, 'year').format('YYYY-MM-DD'),
                    dayjs().subtract(18, 'year').format('YYYY-MM-DD')
                )
            ).format('YYYY-MM-DD');

            const employee = await userRepository.create({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                dateOfBirth,
                email: faker.internet.email().toLowerCase(),
                password: 'Qwerty123!'
            });

            await Promise.all([
                employee.setRoles([roleEmployee]),
                employee.setDepartment(faker.random.arrayElement(departments))
            ]);
        }
    },

    down: () => {}
};
