const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateController {
    constructor(contractRepository, userRepository) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            params: { id },
            body: { userId, position, startDate, endDate, vacationDaysPerYear }
        } = req;

        const contract = await this.contractRepository.getById(id);

        if (!contract) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        const transaction = await this.contractRepository.getDbTransaction();

        try {
            const { userId: oldUserId } = contract;

            await contract.update(
                {
                    userId,
                    position,
                    startDate,
                    endDate,
                    vacationDaysPerYear
                },
                {
                    transaction
                }
            );

            if (oldUserId !== userId) {
                const oldUserVacationDaysSum =
                    await this.contractRepository.sum('vacationDays', {
                        where: { userId: oldUserId },
                        transaction
                    });

                const oldUser = await this.userRepository.findById(oldUserId, {
                    transaction
                });

                await oldUser.update(
                    { vacationDaysSum: oldUserVacationDaysSum },
                    { transaction }
                );
            }

            const vacationDaysSum = await this.contractRepository.sum(
                'vacationDays',
                {
                    where: { userId },
                    transaction
                }
            );

            const user = await this.userRepository.findById(userId, {
                transaction
            });

            await user.update({ vacationDaysSum }, { transaction });

            await transaction.commit();

            const updatedContract = await this.contractRepository.getById(id);

            return res.send(updatedContract);
        } catch (error) {
            await transaction.rollback();

            throw error;
        }
    }
}

module.exports = UpdateController;
