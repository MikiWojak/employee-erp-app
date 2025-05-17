const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateController {
    constructor(contractRepository, userRepository) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id },
            rolesInfo: { isManager },
            body: { userId, position, startDate, endDate, vacationDaysPerYear }
        } = req;

        const contract = await this.contractRepository.getById(id);

        if (!contract) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        const oldUser = await this.userRepository.findById(contract.userId);
        const user = await this.userRepository.findById(userId);

        if (!(oldUser && user)) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send('Selected user not found!');
        }

        if (isManager) {
            if (
                oldUser.departmentId !== loggedUser.departmentId ||
                user.departmentId !== loggedUser.departmentId
            ) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send(
                        'Manager can edit contract of user in the same department only.'
                    );
            }

            const oldUserRolesInfo = await oldUser.rolesInfo();
            const userRolesInfo = await user.rolesInfo();

            if (!oldUserRolesInfo.isEmployee || !userRolesInfo.isEmployee) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send('Manager can edit contract of employee only.');
            }
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
                    vacationDaysPerYear,
                    updatedById: loggedUser.id
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

            await user.update({ vacationDaysSum }, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        const updatedContract = await this.contractRepository.getById(id);

        return res.send(updatedContract);
    }
}

module.exports = UpdateController;
