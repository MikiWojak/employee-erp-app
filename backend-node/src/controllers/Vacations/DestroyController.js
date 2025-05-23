const { StatusCodes: HTTP } = require('http-status-codes');

class DestroyController {
    constructor(vacationRepository) {
        this.vacationRepository = vacationRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id },
            rolesInfo: { isAdmin, isManager }
        } = req;

        const vacation = await this.vacationRepository.getById(id);

        if (!vacation) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        const { userId, approved, user: assignedUser } = vacation;

        if (isAdmin || (isManager && userId !== loggedUser.id)) {
            if (isManager) {
                if (assignedUser.departmentId !== loggedUser.departmentId) {
                    return res
                        .status(HTTP.UNPROCESSABLE_ENTITY)
                        .send(
                            'Manager can delete vacation for user in the same department only.'
                        );
                }

                const userRolesInfo = await assignedUser.rolesInfo();

                if (!userRolesInfo.isEmployee) {
                    return res
                        .status(HTTP.UNPROCESSABLE_ENTITY)
                        .send('Manager can delete vacation for employee only.');
                }
            }

            const transaction =
                await this.vacationRepository.getDbTransaction();

            try {
                await vacation.update(
                    { updatedById: loggedUser.id },
                    { transaction }
                );

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
            if (loggedUser.id !== userId) {
                return res.sendStatus(HTTP.FORBIDDEN);
            }

            if (approved) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send('You cannot delete your approved vacation.');
            }

            const transaction =
                await this.vacationRepository.getDbTransaction();

            try {
                await vacation.update(
                    { updatedById: loggedUser.id },
                    { transaction }
                );

                await vacation.destroy({ transaction });

                await transaction.commit();
            } catch (error) {
                await transaction.rollback();

                throw error;
            }
        }

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = DestroyController;
