const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const loggedOnly = require('../middlewares/loggedOnly');

const {
    Role: { EMPLOYEE }
} = require('../models');

module.exports = di => {
    const indexController = di.get('controllers.feedbackQuestions.index');

    router.get('/', loggedOnly(EMPLOYEE), invoke(indexController));

    return router;
};
