const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const sorting = require('../middlewares/sorting');
const validate = require('../middlewares/validate');
const pagination = require('../middlewares/pagination');
const loggedOnly = require('../middlewares/loggedOnly');
const searchable = require('../middlewares/searchable');
const vacationValidator = require('../validators/vacation');
const paginationValidator = require('../validators/pagination');

const { Vacation } = require('../models');

module.exports = di => {
    const indexController = di.get('controllers.vacations.index');
    const storeController = di.get('controllers.vacations.store');
    const updateController = di.get('controllers.vacations.update');
    const destroyController = di.get('controllers.vacations.destroy');

    router.get(
        '/',
        loggedOnly(),
        [
            paginationValidator.pagination,
            validate,
            searchable(
                Vacation.SEARCHABLE_FIELDS,
                true,
                Vacation.ADMIN_SEARCHABLE_FIELDS
            ),
            pagination,
            sorting()
        ],
        invoke(indexController)
    );
    router.post(
        '/',
        loggedOnly(),
        [vacationValidator.store, validate],
        invoke(storeController)
    );
    router.put(
        '/:id',
        loggedOnly(),
        [vacationValidator.update, validate],
        invoke(updateController)
    );
    router.delete('/:id', loggedOnly(), invoke(destroyController));

    return router;
};
