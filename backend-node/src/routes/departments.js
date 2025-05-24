const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const sorting = require('../middlewares/sorting');
const validate = require('../middlewares/validate');
const pagination = require('../middlewares/pagination');
const searchable = require('../middlewares/searchable');
const loggedOnly = require('../middlewares/loggedOnly');
const departmentValidator = require('../validators/department');
const paginationValidator = require('../validators/pagination');

const {
    Department,
    Role: { ADMIN }
} = require('../models');

module.exports = di => {
    const indexController = di.get('controllers.departments.index');
    const storeController = di.get('controllers.departments.store');
    const updateController = di.get('controllers.departments.update');
    const destroyController = di.get('controllers.departments.destroy');

    router.get(
        '/',
        loggedOnly(ADMIN),
        [
            paginationValidator.pagination,
            validate,
            searchable(Department.SEARCHABLE_FIELDS),
            sorting(),
            pagination
        ],
        invoke(indexController)
    );
    router.post(
        '/',
        loggedOnly(ADMIN),
        [departmentValidator.store, validate],
        invoke(storeController)
    );
    router.put(
        '/:id',
        loggedOnly(ADMIN),
        [departmentValidator.update, validate],
        invoke(updateController)
    );
    router.delete('/:id', loggedOnly(ADMIN), invoke(destroyController));

    return router;
};
