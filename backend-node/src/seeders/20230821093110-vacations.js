'use strict';

const dayjs = require('dayjs');

const {
    Role: { EMPLOYEE, MANAGER }
} = require('../models');

const di = require('../di');
const faker = require('faker');
const userRepository = di.get('repositories.user');
const vacationRepository = di.get('repositories.vacation');

module.exports = {
    up: async () => {
        const users = await userRepository.findAll({
            include: [
                {
                    association: 'role',
                    required: true,
                    where: { name: [EMPLOYEE, MANAGER] }
                },
                {
                    association: 'contracts'
                }
            ]
        });

        for (const user of users) {
            const { id: userId, contracts, vacationDaysSum } = user;

            if (!contracts.length) {
                continue;
            }

            const [contract] = contracts;

            const startDateRaw = faker.date.between(
                contract.startDate,
                dayjs(contract.endDate).subtract(60, 'day').format('YYYY-MM-DD')
            );

            let startDateDayjs = dayjs(startDateRaw);

            if (startDateDayjs.day() === 0 || startDateDayjs.day() === 6) {
                startDateDayjs = startDateDayjs.add(
                    startDateDayjs.day() === 6 ? 2 : 1,
                    'day'
                );
            }

            const startDate = dayjs(startDateDayjs).format('YYYY-MM-DD');

            const endDateRaw = faker.date.between(
                startDate,
                startDateDayjs.add(20, 'day').format('YYYY-MM-DD')
            );

            let endDateDayjs = dayjs(endDateRaw);

            if (endDateDayjs.day() === 0 || endDateDayjs.day() === 6) {
                endDateDayjs = endDateDayjs.add(
                    endDateDayjs.day() === 6 ? 2 : 1,
                    'day'
                );
            }

            const endDate = dayjs(endDateDayjs).format('YYYY-MM-DD');

            const transaction = await vacationRepository.getDbTransaction();

            try {
                await vacationRepository.create(
                    {
                        startDate,
                        endDate,
                        userId,
                        approved: true
                    },
                    { transaction }
                );

                const vacationDaysUsed = await vacationRepository.sum(
                    'duration',
                    {
                        where: { userId, approved: true },
                        transaction
                    }
                );

                await user.update({ vacationDaysUsed }, { transaction });

                await transaction.commit();
            } catch (error) {
                await transaction.rollback();

                console.error(error);
            }
        }
    },

    down: () => {}
};
