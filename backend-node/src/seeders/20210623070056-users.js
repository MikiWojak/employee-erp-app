'use strict';

const faker = require('faker');

const dayjs = require('dayjs');
const { Role } = require('../models');
const di = require('../di');

const roleRepository = di.get('repositories.role');
const userRepository = di.get('repositories.user');
const departmentRepository = di.get('repositories.department');

const getDateOfBirth = () =>
    dayjs(
        faker.date.between(
            dayjs().subtract(65, 'year').format('YYYY-MM-DD'),
            dayjs().subtract(18, 'year').format('YYYY-MM-DD')
        )
    ).format('YYYY-MM-DD');

module.exports = {
    up: async () => {
        const [departments, roleAdmin, roleEmployee] = await Promise.all([
            departmentRepository.findAll(),
            roleRepository.findByName(Role.ADMIN),
            roleRepository.findByName(Role.EMPLOYEE)
        ]);

        const [admin, employee] = await Promise.all([
            userRepository.create({
                firstName: faker.name.firstName(),
                lastName: 'Admin',
                dateOfBirth: getDateOfBirth(),
                email: 'admin@erp.test',
                password: 'Qwerty123!'
            }),
            userRepository.create({
                firstName: faker.name.firstName(),
                lastName: 'Employee',
                dateOfBirth: getDateOfBirth(),
                email: 'employee@erp.test',
                password: 'Qwerty123!'
            })
        ]);

        await Promise.all([
            admin.setRoles([roleAdmin]),
            employee.setRoles([roleEmployee]),
            employee.setDepartment(faker.random.arrayElement(departments))
        ]);
    },

    down: () => {}
};
