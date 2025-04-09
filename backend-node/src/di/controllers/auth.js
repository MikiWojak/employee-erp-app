module.exports = {
    services: {
        'controllers.auth.loginController': {
            class: 'controllers/Auth/LoginController',
            arguments: ['@repositories.user']
        },

        'controllers.auth.meController': {
            class: 'controllers/Auth/MeController',
            arguments: ['@repositories.user']
        },

        'controllers.auth.logoutController': {
            class: 'controllers/Auth/LogoutController',
            arguments: []
        },

        'controllers.auth.setPasswordController': {
            class: 'controllers/Auth/SetPasswordController',
            arguments: ['@repositories.user', '@repositories.passwordReset']
        }
    }
};
