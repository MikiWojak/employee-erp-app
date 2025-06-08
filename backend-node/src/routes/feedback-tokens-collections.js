const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const sorting = require('../middlewares/sorting');
const validate = require('../middlewares/validate');
const pagination = require('../middlewares/pagination');
const loggedOnly = require('../middlewares/loggedOnly');
const paginationValidator = require('../validators/pagination');

const {
    Role: { ADMIN }
} = require('../models');

module.exports = di => {
    const indexController = di.get(
        'controllers.feedbackTokensCollections.index'
    );
    const storeController = di.get(
        'controllers.feedbackTokensCollections.store'
    );

    router.get(
        '/',
        loggedOnly(ADMIN),
        [paginationValidator.pagination, validate, sorting(), pagination],
        invoke(indexController)
    );

    router.post('/', loggedOnly(ADMIN), invoke(storeController));

    return router;
};
