const { body } = require('express-validator');

const checkToken = [body('token').trim()];

const sendResetPasswordLink = [
    body('email')
        .trim()
        .toLowerCase()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isEmail()
        .withMessage('Wrong email format.')
];

const password = [
    body('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isLength(8)
        .withMessage(`This field must have at least 8 letters.`)
];

const login = [...sendResetPasswordLink, ...password];

const setPassword = [
    ...checkToken,

    ...password,

    body('passwordConfirmation')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('This field must be the same as field "password".')
];

const updateProfile = [
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
        .custom(async (email, { req: { app, loggedUser } }) => {
            const di = app.get('di');
            const userRepository = di.get('repositories.user');
            const user = await userRepository.findByEmail(email);

            if (user && user.id !== loggedUser.id) {
                return Promise.reject('Email is already in use.');
            }
        })

    // @TODO Validate 'avatar'
];

module.exports = {
    login,
    checkToken,
    setPassword,
    updateProfile,
    sendResetPasswordLink
};
