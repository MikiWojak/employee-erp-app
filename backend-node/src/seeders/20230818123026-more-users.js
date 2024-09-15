'use strict';
const faker = require('faker');
const dayjs = require('dayjs');

const { Role } = require('../models');

const di = require('../di');
const roleRepository = di.get('repositories.role');
const userRepository = di.get('repositories.user');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { id: employeeId } = await roleRepository.findByName(
            Role.EMPLOYEE
        );

        for (let i = 0; i < 20; i++) {
            const dateOfBirth = dayjs(
                faker.date.between(
                    dayjs().subtract(65, 'year').format('YYYY-MM-DD'),
                    dayjs().subtract(18, 'year').format('YYYY-MM-DD')
                )
            ).format('YYYY-MM-DD');

            await userRepository.create({
                roleId: employeeId,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                dateOfBirth: dateOfBirth,
                email: faker.internet.email().toLowerCase(),
                password: 'Qwerty123!'
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
