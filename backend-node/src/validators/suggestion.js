const { body } = require('express-validator');

const store = [
    body('title').trim().not().isEmpty().withMessage('This field is required.'),

    body('description')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
];

module.exports = {
    store
};
