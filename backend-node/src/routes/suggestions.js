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
    Role: { ADMIN, MANAGER, EMPLOYEE }
} = require('../models');

module.exports = di => {
    const voteController = di.get('controllers.suggestions.vote');
    const indexController = di.get('controllers.suggestions.index');
    const storeController = di.get('controllers.suggestions.store');
    const updateController = di.get('controllers.suggestions.update');
    const statusController = di.get('controllers.suggestions.status');
    const destroyController = di.get('controllers.suggestions.destroy');

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
        '/:id/vote',
        loggedOnly(MANAGER, EMPLOYEE),
        [suggestionValidator.vote, validate],
        invoke(voteController)
    );

    router.post(
        '/:id/status',
        loggedOnly(ADMIN),
        [suggestionValidator.status, validate],
        invoke(statusController)
    );

    router.post(
        '/',
        loggedOnly(MANAGER, EMPLOYEE),
        [suggestionValidator.store, validate],
        invoke(storeController)
    );

    router.put(
        '/:id',
        loggedOnly(MANAGER, EMPLOYEE),
        [suggestionValidator.update, validate],
        invoke(updateController)
    );

    router.delete(
        '/:id',
        loggedOnly(MANAGER, EMPLOYEE),
        invoke(destroyController)
    );

    return router;
};
