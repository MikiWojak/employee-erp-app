const { query } = require('express-validator');

const pagination = [
    query('page')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('Must be greater than 0.'),

    query('perPage')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('Must be greater than 0.'),

    query('query').optional()
];

module.exports = { pagination };
