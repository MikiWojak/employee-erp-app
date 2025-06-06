const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const loggedOnly = require('../middlewares/loggedOnly');

const {
    Role: { MANAGER, EMPLOYEE }
} = require('../models');

module.exports = di => {
    const indexController = di.get('controllers.feedbackQuestions.index');

    router.get('/', loggedOnly(MANAGER, EMPLOYEE), invoke(indexController));

    return router;
};
