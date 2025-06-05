const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const loggedOnly = require('../middlewares/loggedOnly');
const validate = require('../middlewares/validate');
const feedbackAnswerValidator = require('../validators/feedback-answer');

const {
    Role: { ADMIN, EMPLOYEE }
} = require('../models');

module.exports = di => {
    const storeController = di.get('controllers.feedbackAnswers.store');
    const statsController = di.get('controllers.feedbackAnswers.stats');

    router.get('/stats', loggedOnly(ADMIN), invoke(statsController));

    router.post(
        '/',
        loggedOnly(EMPLOYEE),
        [feedbackAnswerValidator.submit, validate],
        invoke(storeController)
    );

    return router;
};
