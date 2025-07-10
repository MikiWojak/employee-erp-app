const { Op } = require('sequelize');
const { body } = require('express-validator');

const areDatesInProperOrder = (startDate, endDate) =>
    new Date(startDate) <= new Date(endDate);

const checkIfVacationsOverlap = async (
    startDate,
    endDate,
    vacationRepository,
    userId,
    vacationId
) => {
    const where = {
        userId,
        startDate: { [Op.lte]: endDate },
        endDate: { [Op.gte]: startDate }
    };

    if (vacationId) {
        where.id = { [Op.not]: vacationId };
    }

    const vacation = await vacationRepository.findOne({
        where
    });

    return !!vacation;
};

const checkIfVacationInsideContract = async (
    startDate,
    endDate,
    userId,
    contractRepository
) => {
    const where = {
        userId,
        startDate: { [Op.lte]: endDate },
        endDate: { [Op.gte]: startDate }
    };

    const contract = await contractRepository.findOne({
        where
    });

    return !!contract;
};

const isWeekend = value => {
    const date = new Date(value);

    return date.getDay() === 0 || date.getDay() === 6;
};

const update = [
    body('userId')
        .if(async (value, { req }) => {
            const { rolesInfo } = req;

            if (rolesInfo.isEmployee) {
                return Promise.reject();
            }
        })
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
                return Promise.reject('User not found.');
            }
        }),

    body('startDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isDate()
        .withMessage('Wrong date format. Should be YYYY-MM-DD.')
        .bail()
        .toDate()
        .custom(startDate => !isWeekend(startDate))
        .withMessage('Date must be a business day.'),

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
        .custom(endDate => !isWeekend(endDate))
        .withMessage('Date must be a business day.')
        .bail()
        .custom(
            (
                endDate,
                {
                    req: {
                        body: { startDate }
                    }
                }
            ) => areDatesInProperOrder(startDate, endDate)
        )
        .withMessage('End date can not be before start date.')
        .bail()
        .custom(
            async (
                endDate,
                {
                    req: {
                        app,
                        loggedUser,
                        params: { id: vacationId },
                        body: { userId, startDate },
                        rolesInfo: { isManager, isEmployee }
                    }
                }
            ) => {
                const di = app.get('di');
                const userRepository = di.get('repositories.user');
                const contractRepository = di.get('repositories.contract');
                const vacationRepository = di.get('repositories.vacation');

                if (isManager && userId !== loggedUser.id) {
                    const user = await userRepository.findEmployee(userId);

                    if (
                        !user ||
                        user.departmentId !== loggedUser.departmentId
                    ) {
                        return Promise.reject(
                            'Unable to verify if vacation overlaps other one.'
                        );
                    }
                }

                const uid = isEmployee ? loggedUser.id : userId;

                const doVacationsOverlap = await checkIfVacationsOverlap(
                    startDate,
                    endDate,
                    vacationRepository,
                    uid,
                    vacationId
                );

                if (doVacationsOverlap) {
                    return Promise.reject('Vacation overlaps other one.');
                }

                const isVacationInsideContract =
                    await checkIfVacationInsideContract(
                        startDate,
                        endDate,
                        uid,
                        contractRepository
                    );

                if (!isVacationInsideContract) {
                    return Promise.reject(
                        'Vacation must be during one of contracts.'
                    );
                }
            }
        ),

    body('approved')
        .if(
            async (
                value,
                {
                    req: {
                        body,
                        loggedUser,
                        rolesInfo: { isEmployee, isManager }
                    }
                }
            ) => {
                if (
                    isEmployee ||
                    (isManager && body.userId === loggedUser.id)
                ) {
                    return Promise.reject();
                }
            }
        )
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isBoolean()
        .withMessage('This field must be a boolean.')
        .toBoolean()
];

const store = [...update];

module.exports = {
    store,
    update
};
