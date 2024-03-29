const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(vacationRepository, userRepository) {
        this.vacationRepository = vacationRepository;
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            body: { userId, startDate, endDate, approved }
        } = req;

        const isAdmin = await loggedUser.isAdmin();

        let vacation;

        if (isAdmin) {
            const transaction = await this.vacationRepository.getDbTransaction();

            try {
                const { id } = await this.vacationRepository.create(
                    {
                        userId,
                        startDate,
                        endDate,
                        approved
                    },
                    { transaction }
                );

                if (approved) {
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
                }

                await transaction.commit();

                vacation = await this.vacationRepository.getById(id);
            } catch (error) {
                await transaction.rollback();

                throw error;
            }
        } else {
            if (loggedUser.id !== userId) {
                return res.sendStatus(HTTP.FORBIDDEN);
            }

            const { id } = await this.vacationRepository.create({
                userId,
                startDate,
                endDate,
                approved: false
            });

            vacation = await this.vacationRepository.findById(id);
        }

        return res.status(HTTP.CREATED).send(vacation);
    }
}

module.exports = StoreController;
