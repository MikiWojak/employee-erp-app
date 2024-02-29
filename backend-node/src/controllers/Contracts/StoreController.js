const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(contractRepository, userRepository) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            body: { userId, position, startDate, endDate, vacationDaysPerYear }
        } = req;

        const transaction = await this.contractRepository.getDbTransaction();

        try {
            const { id } = await this.contractRepository.create(
                {
                    userId,
                    position,
                    startDate,
                    endDate,
                    vacationDaysPerYear
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

            const contract = await this.contractRepository.getById(id);

            return res.status(HTTP.CREATED).send(contract);
        } catch (error) {
            await transaction.rollback();

            throw error;
        }
    }
}

module.exports = StoreController;
