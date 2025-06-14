const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const sorting = require('../middlewares/sorting');
const validate = require('../middlewares/validate');
const pagination = require('../middlewares/pagination');
const loggedOnly = require('../middlewares/loggedOnly');
const searchable = require('../middlewares/searchable');
const paginationValidator = require('../validators/pagination');
const suggestionValidator = require('../validators/suggestion');

const {
    Suggestion,
    Role: { MANAGER, EMPLOYEE }
} = require('../models');

module.exports = di => {
    const indexController = di.get('controllers.suggestions.index');
    const storeController = di.get('controllers.suggestions.store');

    router.get(
        '/',
        loggedOnly(),
        [
            paginationValidator.pagination,
            validate,
            searchable(Suggestion.SEARCHABLE_FIELDS),
            sorting(),
            pagination
        ],
        invoke(indexController)
    );

    router.post(
        '/',
        loggedOnly(MANAGER, EMPLOYEE),
        [suggestionValidator.store, validate],
        invoke(storeController)
    );

    return router;
};
