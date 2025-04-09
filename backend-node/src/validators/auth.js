const { body } = require('express-validator');

const login = [
    body('email')
        .trim()
        .toLowerCase()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isEmail()
        .withMessage('Wrong email format.'),

    body('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isLength(8)
        .withMessage(`This field must have at least 8 letters.`)
];

const setPassword = [
    body('token').trim().not().isEmpty().withMessage('This field is required.'),

    body('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isLength(8)
        .withMessage(`This field must have at least 8 letters.`),

    body('passwordConfirmation')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .custom((value, { req }) => value === req.body.password)
];

module.exports = { login, setPassword };
