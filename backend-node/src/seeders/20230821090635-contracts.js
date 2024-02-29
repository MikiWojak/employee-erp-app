'use strict';
const faker = require('faker');
const dayjs = require('dayjs');

const { Role } = require('../models');

const di = require('../di');
const userRepository = di.get('repositories.user');
const contractRepository = di.get('repositories.contract');

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await userRepository.findAll({
            include: [
                {
                    association: 'role',
                    required: true,
                    where: { name: Role.EMPLOYEE }
                }
            ]
        });

        for (let user of users) {
            const userId = user.id;
            const transaction = await contractRepository.getDbTransaction();

            const startDate = dayjs(
                faker.date.between(
                    dayjs().subtract(2, 'year').format('YYYY-MM-DD'),
                    dayjs().add(2, 'year').format('YYYY-MM-DD')
                )
            ).format('YYYY-MM-DD');

            const endDate = dayjs(
                faker.date.between(
                    startDate,
                    dayjs(startDate).add(5, 'year').format('YYYY-MM-DD')
                )
            ).format('YYYY-MM-DD');

            try {
                await contractRepository.create(
                    {
                        userId,
                        position: faker.name.jobType(),
                        startDate,
                        endDate,
                        vacationDaysPerYear: faker.random.arrayElement([20, 26])
                    },
                    { transaction }
                );

                const vacationDaysSum = await contractRepository.sum(
                    'vacationDays',
                    {
                        where: { userId },
                        transaction
                    }
                );

                await user.update({ vacationDaysSum }, { transaction });

                await transaction.commit();
            } catch (error) {
                await transaction.rollback();

                console.error(error);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Contracts', null, {});
    }
};
