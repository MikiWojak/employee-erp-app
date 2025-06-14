const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const loggedOnly = require('../middlewares/loggedOnly');

const {
    Role: { ADMIN, MANAGER, EMPLOYEE }
} = require('../models');

module.exports = di => {
    const indexController = di.get('controllers.feedbackQuestions.index');
    const statsController = di.get('controllers.feedbackQuestions.stats');

    router.get('/', loggedOnly(MANAGER, EMPLOYEE), invoke(indexController));
    router.get('/stats', loggedOnly(ADMIN, MANAGER), invoke(statsController));

    return router;
};
