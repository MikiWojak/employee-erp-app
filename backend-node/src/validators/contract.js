const { Op } = require('sequelize');
const { body } = require('express-validator');

const areDatesInProperOrder = (startDate, endDate) =>
    new Date(startDate) <= new Date(endDate);

const checkIfContractsOverlap = async (
    startDate,
    endDate,
    contractRepository,
    userId,
    contractId
) => {
    const where = {
        userId,
        startDate: { [Op.lte]: endDate },
        endDate: { [Op.gte]: startDate }
    };

    if (contractId) {
        where.id = { [Op.not]: contractId };
    }

    const contract = await contractRepository.findOne({
        where
    });

    return !!contract;
};

const update = [
    body('userId')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isUUID(4)
        .withMessage('Wrong UUID format.')
        .bail()
        .custom(async (userId, { req: { app } }) => {
            const di = app.get('di');
            const userRepository = di.get('repositories.user');
            const user = await userRepository.findById(userId);

            if (!user) {
                return Promise.reject('Employee not found.');
            }
        }),

    body('position')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.'),

    body('startDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isDate()
        .withMessage('Wrong date format. Should be YYYY-MM-DD.')
        .toDate(),

    body('endDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isDate()
        .withMessage('Wrong date format. Should be YYYY-MM-DD.')
        .bail()
        .toDate()
        .custom((endDate, { req: { body: { startDate } } }) =>
            areDatesInProperOrder(startDate, endDate)
        )
        .withMessage('End date can not be before start date.')
        .bail()
        .custom(
            async (
                endDate,
                {
                    req: {
                        params: { id: contractId },
                        app,
                        body: { userId, startDate }
                    }
                }
            ) => {
                const di = app.get('di');
                const contractRepository = di.get('repositories.contract');

                const doContractsOverlap = await checkIfContractsOverlap(
                    startDate,
                    endDate,
                    contractRepository,
                    userId,
                    contractId
                );

                if (doContractsOverlap) {
                    return Promise.reject('Contract overlaps other one.');
                }
            }
        ),

    body('vacationDaysPerYear')
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isInt()
        .withMessage('This field must be an integer.')
        .toInt()
];

const store = [...update];

module.exports = {
    store,
    update
};
