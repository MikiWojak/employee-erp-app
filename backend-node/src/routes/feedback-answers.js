const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const loggedOnly = require('../middlewares/loggedOnly');

const {
    Role: { EMPLOYEE }
} = require('../models');

module.exports = di => {
    const storeController = di.get('controllers.feedbackAnswers.store');

    router.post('/', loggedOnly(EMPLOYEE), invoke(storeController));

    return router;
};
