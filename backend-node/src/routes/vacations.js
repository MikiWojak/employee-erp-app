const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const sorting = require('../middlewares/sorting');
const validate = require('../middlewares/validate');
const pagination = require('../middlewares/pagination');
const loggedOnly = require('../middlewares/loggedOnly');
const vacationValidator = require('../validators/vacation');
const paginationValidator = require('../validators/pagination');

module.exports = di => {
    const indexController = di.get('controllers.vacations.indexController');
    const storeController = di.get('controllers.vacations.storeController');
    const updateController = di.get('controllers.vacations.updateController');
    const destroyController = di.get('controllers.vacations.destroyController');

    router.get(
        '/',
        loggedOnly(),
        [paginationValidator.pagination, validate, pagination, sorting()],
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
