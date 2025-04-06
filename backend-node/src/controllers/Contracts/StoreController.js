const { StatusCodes: HTTP } = require('http-status-codes');

const { EmailTypes } = require('../../enums/EmailTypes');

class StoreController {
    constructor(contractRepository, userRepository, sendEmailHandler) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.sendEmailHandler = sendEmailHandler;
    }

    async invoke(req, res) {
        const {
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

            contractId = id;
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        if (!contractId) {
            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }

        const contract = await this.contractRepository.getById(contractId);

        const {
            user: { firstName }
        } = contract;

        await this.sendEmailHandler.handle(
            EmailTypes.ContractStore,
            contract.user.email,
            {
                firstName,
                position: contract.position,
                startDate: contract.startDate,
                endDate: contract.endDate
            }
        );

        return res.status(HTTP.CREATED).send(contract);
    }
}

module.exports = StoreController;
