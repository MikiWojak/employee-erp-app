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
            rolesInfo: { isAdmin, isManager },
            body: { userId, startDate, endDate, approved }
        } = req;

        const vacation = await this.vacationRepository.getById(id);

        if (!vacation) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        if (isAdmin || (isManager && userId !== loggedUser.id)) {
            const { userId: oldUserId } = vacation;

            const oldUser = await this.userRepository.findById(oldUserId);
            const user = await this.userRepository.findById(userId);

            const oldUserRolesInfo = await oldUser.rolesInfo();
            const userRolesInfo = await user.rolesInfo();

            if (userRolesInfo.isAdmin) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send('You cannot assign vacation to admin.');
            }

            if (isManager) {
                if (
                    oldUser.departmentId !== loggedUser.departmentId ||
                    user.departmentId !== loggedUser.departmentId
                ) {
                    return res
                        .status(HTTP.UNPROCESSABLE_ENTITY)
                        .send(
                            'Manager can edit vacation of user in the same department only.'
                        );
                }

                if (!oldUserRolesInfo.isEmployee || !userRolesInfo.isEmployee) {
                    return res
                        .status(HTTP.UNPROCESSABLE_ENTITY)
                        .send('Manager can edit vacation of employee only.');
                }
            }

            const transaction =
                await this.vacationRepository.getDbTransaction();

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
                    const oldVacationDaysUsed =
                        await this.vacationRepository.sum('duration', {
                            where: { userId: oldUserId, approved: true },
                            transaction
                        });

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

                await user.update({ vacationDaysUsed }, { transaction });

                await transaction.commit();
            } catch (error) {
                await transaction.rollback();

                throw error;
            }
        } else {
            const { userId, approved } = vacation;

            if (loggedUser.id !== userId) {
                return res.sendStatus(HTTP.FORBIDDEN);
            }

            if (approved) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send('You cannot edit your approved vacation.');
            }

            await vacation.update({
                startDate,
                endDate
            });
        }

        const updatedVacation = await this.vacationRepository.getById(id);

        return res.send(updatedVacation);
    }
}

module.exports = UpdateController;
