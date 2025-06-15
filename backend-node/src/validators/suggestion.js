const { body } = require('express-validator');

const update = [
    body('title').trim().not().isEmpty().withMessage('This field is required.'),

    body('description')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
];

const store = update;

module.exports = {
    store,
    update
};
