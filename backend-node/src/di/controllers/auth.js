module.exports = {
    services: {
        'controllers.auth.login': {
            class: 'controllers/Auth/LoginController',
            arguments: ['@repositories.user']
        },

        'controllers.auth.me': {
            class: 'controllers/Auth/MeController',
            arguments: ['@repositories.user']
        },

        'controllers.auth.logout': {
            class: 'controllers/Auth/LogoutController',
            arguments: []
        },

        'controllers.auth.setPassword': {
            class: 'controllers/Auth/SetPasswordController',
            arguments: [
                '@repositories.user',
                '@repositories.passwordReset',
                '@services.sendEmail'
            ]
        },

        'controllers.auth.checkSetPasswordToken': {
            class: 'controllers/Auth/CheckSetPasswordTokenController',
            arguments: ['@repositories.passwordReset']
        },

        'controllers.auth.sendResetPasswordLink': {
            class: 'controllers/Auth/SendResetPasswordLinkController',
            arguments: [
                '@repositories.user',
                '@services.sendEmail',
                '@services.auth.getPasswordSetLink'
            ]
        }
    }
};
