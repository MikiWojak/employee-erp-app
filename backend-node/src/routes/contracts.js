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
    Role: { ADMIN }
} = require('../models');

module.exports = di => {
    const indexController = di.get('controllers.contracts.indexController');
    const storeController = di.get('controllers.contracts.storeController');
    const updateController = di.get('controllers.contracts.updateController');
    const destroyController = di.get('controllers.contracts.destroyController');

    router.get(
        '/',
        loggedOnly(),
        [
            paginationValidator.pagination,
            validate,
            searchable(
                Contract.SEARCHABLE_FIELDS,
                true,
                Contract.ADMIN_SEARCHABLE_FIELDS
            ),
            pagination,
            sorting()
        ],
        invoke(indexController)
    );
    router.post(
        '/',
        loggedOnly(ADMIN),
        [contractValidator.store, validate],
        invoke(storeController)
    );
    router.put(
        '/:id',
        loggedOnly(ADMIN),
        [contractValidator.update, validate],
        invoke(updateController)
    );
    router.delete('/:id', loggedOnly(ADMIN), invoke(destroyController));

    return router;
};
