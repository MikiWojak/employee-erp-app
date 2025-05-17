'use strict';

const dayjs = require('dayjs');
const faker = require('faker');

const {
    Role: { EMPLOYEE, MANAGER }
} = require('../models');

const di = require('../di');
const userRepository = di.get('repositories.user');
const contractRepository = di.get('repositories.contract');

module.exports = {
    up: async () => {
        const users = await userRepository.findAll({
            include: [
                {
                    association: 'role',
                    required: true,
                    where: { name: [EMPLOYEE, MANAGER] }
                }
            ]
        });

        for (const user of users) {
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

    down: () => {}
};
