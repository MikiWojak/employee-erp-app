const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const loggedOnly = require('../middlewares/loggedOnly');
const validate = require('../middlewares/validate');
const feedbackAnswerValidator = require('../validators/feedback-answer');

const {
    Role: { MANAGER, EMPLOYEE }
} = require('../models');

module.exports = di => {
    const storeController = di.get('controllers.feedbackAnswers.store');
    const checkTokenController = di.get(
        'controllers.feedbackAnswers.checkToken'
    );

    router.get(
        '/check-token',
        loggedOnly(MANAGER, EMPLOYEE),
        invoke(checkTokenController)
    );

    router.post(
        '/',
        loggedOnly(MANAGER, EMPLOYEE),
        [feedbackAnswerValidator.submit, validate],
        invoke(storeController)
    );

    return router;
};
