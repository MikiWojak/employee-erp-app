const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateController {
    constructor(vacationRepository, userRepository) {
        this.vacationRepository = vacationRepository;
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id },
            body: { userId, startDate, endDate, approved }
        } = req;

        const vacation = await this.vacationRepository.getById(id);

        if (!vacation) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        const isAdmin = await loggedUser.isAdmin();

        let updatedVacation;

        if (isAdmin) {
            const transaction = await this.vacationRepository.getDbTransaction();

            const { userId: oldUserId } = vacation;

            try {
                await vacation.update(
                    {
                        userId,
                        startDate,
                        endDate,
                        approved
                    },
                    { transaction }
                );

                if (oldUserId !== userId) {
                    const oldVacationDaysUsed = await this.vacationRepository.sum(
                        'duration',
                        {
                            where: { userId: oldUserId, approved: true },
                            transaction
                        }
                    );

                    const oldUser = await this.userRepository.findById(
                        oldUserId,
                        {
                            transaction
                        }
                    );

                    await oldUser.update(
                        { vacationDaysUsed: oldVacationDaysUsed },
                        { transaction }
                    );
                }

                const vacationDaysUsed = await this.vacationRepository.sum(
                    'duration',
                    {
                        where: { userId, approved: true },
                        transaction
                    }
                );

                const user = await this.userRepository.findById(userId, {
                    transaction
                });

                await user.update({ vacationDaysUsed }, { transaction });

                await transaction.commit();

                updatedVacation = await this.vacationRepository.getById(id);
            } catch (error) {
                await transaction.rollback();

                throw error;
            }
        } else {
            const { userId, approved } = vacation;

            if (loggedUser.id !== userId || approved) {
                return res.sendStatus(HTTP.FORBIDDEN);
            }

            await vacation.update({
                startDate,
                endDate
            });

            updatedVacation = await this.vacationRepository.findById(id);
        }

        return res.send(updatedVacation);
    }
}

module.exports = UpdateController;
