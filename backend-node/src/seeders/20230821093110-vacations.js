'use strict';

const dayjs = require('dayjs');

const {
    Role: { EMPLOYEE, MANAGER }
} = require('../models');

const di = require('../di');
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

            const startDate = contract.startDate;
            const endDate = dayjs(contract.startDate)
                .add(Math.random() * (vacationDaysSum + 10 - 3) + 3, 'day')
                .format('YYYY-MM-DD');

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
