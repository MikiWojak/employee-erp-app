const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(vacationRepository, userRepository) {
        this.vacationRepository = vacationRepository;
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            rolesInfo: { isAdmin, isManager },
            body: { userId, startDate, endDate, approved }
        } = req;

        let vacationId;

        if (isAdmin || (isManager && userId !== loggedUser.id)) {
            const user = await this.userRepository.findById(userId);

            const assignedUserRolesInfo = await user.rolesInfo();

            if (assignedUserRolesInfo.isAdmin) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send('You cannot add vacation for admin.');
            }

            if (isManager) {
                if (user.departmentId !== loggedUser.departmentId) {
                    return res
                        .status(HTTP.UNPROCESSABLE_ENTITY)
                        .send(
                            'Manager can add vacation for user in the same department only.'
                        );
                }

                if (!assignedUserRolesInfo.isEmployee) {
                    return res
                        .status(HTTP.UNPROCESSABLE_ENTITY)
                        .send('Manager can add vacation for employee only.');
                }
            }

            const transaction =
                await this.vacationRepository.getDbTransaction();

            try {
                const { id } = await this.vacationRepository.create(
                    {
                        userId,
                        startDate,
                        endDate,
                        approved,
                        createdById: loggedUser.id,
                        updatedById: loggedUser.id
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

                vacationId = id;
            } catch (error) {
                await transaction.rollback();

                throw error;
            }
        } else {
            const { id } = await this.vacationRepository.create({
                userId: loggedUser.id,
                startDate,
                endDate,
                approved: false,
                createdById: loggedUser.id,
                updatedById: loggedUser.id
            });

            vacationId = id;
        }

        const vacation = await this.vacationRepository.getById(vacationId);

        return res.status(HTTP.CREATED).send(vacation);
    }
}

module.exports = StoreController;
