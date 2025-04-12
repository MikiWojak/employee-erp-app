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
    const setPasswordController = di.get(
        'controllers.auth.setPasswordController'
    );
    const checkSetPasswordTokenController = di.get(
        'controllers.auth.checkSetPasswordTokenController'
    );
    const sendResetPasswordLinkController = di.get(
        'controllers.auth.sendResetPasswordLinkController'
    );

    router.post(
        '/login',
        [authValidator.login, validate],
        invoke(loginController)
    );
    router.post('/logout', invoke(logoutController));
    router.get('/me', loggedOnly(), invoke(meController));
    router.post(
        '/check-set-password-token',
        [authValidator.checkToken, validate],
        invoke(checkSetPasswordTokenController)
    );
    router.post(
        '/set-password',
        [authValidator.setPassword, validate],
        invoke(setPasswordController)
    );
    router.post(
        '/send-reset-password-link',
        [authValidator.sendResetPasswordLink, validate],
        invoke(sendResetPasswordLinkController)
    );

    return router;
};
