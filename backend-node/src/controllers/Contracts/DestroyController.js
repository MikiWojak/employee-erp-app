const { StatusCodes: HTTP } = require('http-status-codes');

class DestroyController {
    constructor(contractRepository) {
        this.contractRepository = contractRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id },
            rolesInfo: { isManager }
        } = req;

        const contract = await this.contractRepository.getById(id);

        if (!contract) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        if (!contract.user) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send('Selected user not found!');
        }

        if (isManager) {
            if (contract.user.departmentId !== loggedUser.departmentId) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send(
                        'Manager can delete contract of user in the same department only.'
                    );
            }

            const userRolesInfo = await contract.user.rolesInfo();

            if (!userRolesInfo.isEmployee) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send('Manager can add contract of employee only.');
            }
        }

        const transaction = await this.contractRepository.getDbTransaction();

        try {
            const { userId, user } = contract;

            await contract.update(
                { updatedById: loggedUser.id },
                {
                    transaction
                }
            );
            await contract.destroy({
                transaction
            });

            const vacationDaysSum = await this.contractRepository.sum(
                'vacationDays',
                {
                    where: { userId },
                    transaction
                }
            );

            await user.update({ vacationDaysSum }, { transaction });

            await transaction.commit();

            return res.sendStatus(HTTP.NO_CONTENT);
        } catch (error) {
            await transaction.rollback();

            throw error;
        }
    }
}

module.exports = DestroyController;
