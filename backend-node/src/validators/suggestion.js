const { body } = require('express-validator');

const {
    Suggestion: { ALL_STATUSES }
} = require('../models');

const update = [
    body('title')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isLength({ min: 2, max: 255 })
        .withMessage('This field must have between 2 and 255 characters.'),

    body('description')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isLength({ min: 2, max: 5000 })
        .withMessage('This field must have between 2 and 5000 characters.')
];

const store = update;

const vote = [
    body('vote')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isInt()
        .withMessage('This field must be an integer.')
        .bail()
        .toInt()
        .isIn([1, -1])
        .withMessage("This field must have value either '1' or '-1'.")
];

const status = [
    body('status')
        .trim()
        .not()
        .isEmpty()
        .withMessage('This field is required.')
        .bail()
        .isIn(ALL_STATUSES)
        .withMessage(
            `This field must have one of these values: ${ALL_STATUSES.join(', ')}`
        )
];

module.exports = {
    store,
    update,
    vote,
    status
};
