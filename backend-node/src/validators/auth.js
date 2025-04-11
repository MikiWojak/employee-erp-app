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

module.exports = { login, checkToken, setPassword, sendResetPasswordLink };
