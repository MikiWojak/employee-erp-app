const { body } = require('express-validator');

const {
    Role: { ADMIN, MANAGER, EMPLOYEE }
} = require('../models');

const update = [
    body('firstName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isLength({ min: 2, max: 255 })
        .withMessage('This field must have between 2 and 255 characters.'),

    body('lastName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isLength({ min: 2, max: 255 })
        .withMessage('This field must have between 2 and 255 characters.'),

    body('role')
        .if(async (value, { req }) => {
            const { rolesInfo } = req;

            if (!rolesInfo.isAdmin) {
                return Promise.reject();
            }
        })
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .isIn([ADMIN, MANAGER, EMPLOYEE])
        .withMessage('This role does not exist.'),

    body('departmentId')
        .if(async (value, { req: { body } }) => {
            const { rolesInfo } = req;

            if (!rolesInfo.isAdmin) {
                return Promise.reject();
            }

            if (body.role === ADMIN) {
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
        .custom(async (departmentId, { req: { app } }) => {
            const di = app.get('di');
            const departmentRepository = di.get('repositories.department');
            const department =
                await departmentRepository.findById(departmentId);

            if (!department) {
                return Promise.reject('Department not found.');
            }
        }),

    body('dateOfBirth')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isDate()
        .withMessage('Wrong date format. Should be YYYY-MM-DD.')
        .bail()
        .toDate()
        .isBefore()
        .withMessage('Date must be no later than today.'),

    body('email')
        .trim()
        .toLowerCase()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isEmail()
        .withMessage('Wrong email format.')
        .bail()
        .custom(
            async (
                email,
                {
                    req: {
                        app,
                        params: { id }
                    }
                }
            ) => {
                const di = app.get('di');
                const userRepository = di.get('repositories.user');
                const user = await userRepository.findByEmail(email);

                if (user && user.id !== id) {
                    return Promise.reject('Email is already in use.');
                }
            }
        )
];

const store = update;

module.exports = {
    store,
    update
};
