const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const sorting = require('../middlewares/sorting');
const validate = require('../middlewares/validate');
const pagination = require('../middlewares/pagination');
const searchable = require('../middlewares/searchable');
const loggedOnly = require('../middlewares/loggedOnly');
const userValidator = require('../validators/user');
const paginationValidator = require('../validators/pagination');

const {
    User,
    Role: { ADMIN }
} = require('../models');

module.exports = di => {
    const indexController = di.get('controllers.users.indexController');
    const storeController = di.get('controllers.users.storeController');
    const updateController = di.get('controllers.users.updateController');
    const destroyController = di.get('controllers.users.destroyController');

    router.get(
        '/',
        loggedOnly(ADMIN),
        [
            paginationValidator.pagination,
            validate,
            searchable([], true, User.ADMIN_SEARCHABLE_FIELDS),
            sorting(),
            pagination
        ],
        invoke(indexController)
    );
    router.post(
        '/',
        loggedOnly(ADMIN),
        [userValidator.store, validate],
        invoke(storeController)
    );
    router.put(
        '/:id',
        loggedOnly(ADMIN),
        [userValidator.update, validate],
        invoke(updateController)
    );
    router.delete('/:id', loggedOnly(ADMIN), invoke(destroyController));

    return router;
};
