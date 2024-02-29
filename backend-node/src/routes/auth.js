const express = require('express');
const router = express.Router();

const invoke = require('../middlewares/invoke');
const validate = require('../middlewares/validate');
const loggedOnly = require('../middlewares/loggedOnly');
const authValidator = require('../validators/auth');

module.exports = di => {
    const meController = di.get('controllers.auth.meController');
    const loginController = di.get('controllers.auth.loginController');
    const logoutController = di.get('controllers.auth.logoutController');

    router.post(
        '/login',
        [authValidator.login, validate],
        invoke(loginController)
    );
    router.post('/logout', invoke(logoutController));
    router.get('/me', loggedOnly(), invoke(meController));

    return router;
};
