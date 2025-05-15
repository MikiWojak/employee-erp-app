module.exports = {
    services: {
        'controllers.users.index': {
            class: 'controllers/Users/IndexController',
            arguments: ['@repositories.user']
        },

        'controllers.users.store': {
            class: 'controllers/Users/StoreController',
            arguments: [
                '@repositories.user',
                '@repositories.role',
                '@services.sendEmail',
                '@services.auth.getPasswordSetLink'
            ]
        },

        'controllers.users.update': {
            class: 'controllers/Users/UpdateController',
            arguments: ['@repositories.user', '@repositories.role']
        },

        'controllers.users.destroy': {
            class: 'controllers/Users/DestroyController',
            arguments: ['@repositories.user', '@services.sendEmail']
        }
    }
};
