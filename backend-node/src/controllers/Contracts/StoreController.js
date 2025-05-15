const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(contractRepository, userRepository) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            body: { userId, position, startDate, endDate, vacationDaysPerYear }
        } = req;

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

            const user = await this.userRepository.findById(userId, {
                transaction
            });

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
