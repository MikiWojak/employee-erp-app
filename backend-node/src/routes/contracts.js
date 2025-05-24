const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const sorting = require('../middlewares/sorting');
const validate = require('../middlewares/validate');
const pagination = require('../middlewares/pagination');
const loggedOnly = require('../middlewares/loggedOnly');
const searchable = require('../middlewares/searchable');
const contractValidator = require('../validators/contract');
const paginationValidator = require('../validators/pagination');

const {
    Contract,
    Role: { ADMIN, MANAGER }
} = require('../models');

module.exports = di => {
    const indexController = di.get('controllers.contracts.index');
    const storeController = di.get('controllers.contracts.store');
    const updateController = di.get('controllers.contracts.update');
    const destroyController = di.get('controllers.contracts.destroy');

    router.get(
        '/',
        loggedOnly(),
        [
            paginationValidator.pagination,
            validate,
            searchable(Contract.SEARCHABLE_FIELDS),
            pagination,
            sorting()
        ],
        invoke(indexController)
    );
    router.post(
        '/',
        loggedOnly(ADMIN, MANAGER),
        [contractValidator.store, validate],
        invoke(storeController)
    );
    router.put(
        '/:id',
        loggedOnly(ADMIN, MANAGER),
        [contractValidator.update, validate],
        invoke(updateController)
    );
    router.delete(
        '/:id',
        loggedOnly(ADMIN, MANAGER),
        invoke(destroyController)
    );

    return router;
};
