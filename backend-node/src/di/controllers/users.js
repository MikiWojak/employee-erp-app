module.exports = {
    services: {
        'controllers.users.indexController': {
            class: 'controllers/Users/IndexController',
            arguments: ['@repositories.user']
        },

        'controllers.users.storeController': {
            class: 'controllers/Users/StoreController',
            arguments: ['@repositories.user', '@repositories.role', '@mailer']
        },

        'controllers.users.updateController': {
            class: 'controllers/Users/UpdateController',
            arguments: ['@repositories.user']
        },

        'controllers.users.destroyController': {
            class: 'controllers/Users/DestroyController',
            arguments: ['@repositories.user']
        }
    }
};
