const { StatusCodes: HTTP } = require('http-status-codes');

class DestroyController {
    constructor(contractRepository) {
        this.contractRepository = contractRepository;
    }

    async invoke(req, res) {
        const {
            params: { id }
        } = req;

        const contract = await this.contractRepository.getById(id);

        if (!contract) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        const transaction = await this.contractRepository.getDbTransaction();

        try {
            const { userId, user } = contract;

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
