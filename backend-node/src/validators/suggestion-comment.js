const { body } = require('express-validator');

const update = [
    body('content')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isLength({ min: 2, max: 5000 })
        .withMessage('This field must have between 2 and 5000 characters.')
];

const store = update;

module.exports = {
    store,
    update
};
