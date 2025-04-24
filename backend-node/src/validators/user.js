const { body } = require('express-validator');

const update = [
    body('firstName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.'),

    body('lastName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.'),

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
