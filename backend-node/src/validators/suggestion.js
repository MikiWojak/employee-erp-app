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

const vote = [
    body('vote')
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isInt()
        .withMessage('This field must be an integer.')
        .toInt()
        .isIn([1, -1])
        .withMessage("This field must have value either '1' or '-1'.")
];

module.exports = {
    store,
    update,
    vote
};
