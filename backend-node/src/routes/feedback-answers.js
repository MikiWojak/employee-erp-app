const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const loggedOnly = require('../middlewares/loggedOnly');

const {
    Role: { ADMIN, EMPLOYEE }
} = require('../models');

module.exports = di => {
    const storeController = di.get('controllers.feedbackAnswers.store');
    const statsController = di.get('controllers.feedbackAnswers.stats');

    router.get('/stats', loggedOnly(ADMIN), invoke(statsController));

    router.post('/', loggedOnly(EMPLOYEE), invoke(storeController));

    return router;
};
