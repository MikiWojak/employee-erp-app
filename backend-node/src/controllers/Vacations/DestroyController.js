const { StatusCodes: HTTP } = require('http-status-codes');

class DestroyController {
    constructor(vacationRepository) {
        this.vacationRepository = vacationRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id }
        } = req;

        const vacation = await this.vacationRepository.getById(id);

        if (!vacation) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        const isAdmin = await loggedUser.isAdmin();

        const { userId, approved, user: assignedUser } = vacation;

        if (isAdmin) {
            const transaction = await this.vacationRepository.getDbTransaction();

            try {
                await vacation.destroy({ transaction });

                if (approved) {
                    const vacationDaysUsed = await this.vacationRepository.sum(
                        'duration',
                        {
                            where: { userId, approved: true },
                            transaction
                        }
                    );

                    await assignedUser.update(
                        { vacationDaysUsed },
                        { transaction }
                    );
                }

                await transaction.commit();
            } catch (error) {
                await transaction.rollback();

                throw error;
            }
        } else {
            if (loggedUser.id !== userId || approved) {
                return res.sendStatus(HTTP.FORBIDDEN);
            }

            await vacation.destroy();
        }

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = DestroyController;
