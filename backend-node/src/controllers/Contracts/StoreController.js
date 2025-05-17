const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(contractRepository, userRepository) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            rolesInfo: { isManager },
            body: { userId, position, startDate, endDate, vacationDaysPerYear }
        } = req;

        const user = await this.userRepository.findById(userId);

        if (!user) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send('Selected user not found!');
        }

        if (isManager) {
            if (user.departmentId !== loggedUser.departmentId) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send(
                        'Manager can add contract for user in the same department only.'
                    );
            }

            const userRolesInfo = await user.rolesInfo();

            if (!userRolesInfo.isEmployee) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send('Manager can add contract for employee only.');
            }
        }

        const transaction = await this.contractRepository.getDbTransaction();

        let contractId = null;

        try {
            const { id } = await this.contractRepository.create(
                {
                    userId,
                    position,
                    startDate,
                    endDate,
                    vacationDaysPerYear,
                    createdById: loggedUser.id,
                    updatedById: loggedUser.id
                },
                { transaction }
            );

            const vacationDaysSum = await this.contractRepository.sum(
                'vacationDays',
                {
                    where: { userId },
                    transaction
                }
            );

            await user.update({ vacationDaysSum }, { transaction });

            await transaction.commit();

            contractId = id;
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        if (!contractId) {
            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }

        const contract = await this.contractRepository.getById(contractId);

        return res.status(HTTP.CREATED).send(contract);
    }
}

module.exports = StoreController;
