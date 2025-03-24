module.exports = {
    services: {
        'controllers.contracts.indexController': {
            class: 'controllers/Contracts/IndexController',
            arguments: ['@repositories.contract']
        },

        'controllers.contracts.storeController': {
            class: 'controllers/Contracts/StoreController',
            arguments: [
                '@repositories.contract',
                '@repositories.user',
                '@mailer'
            ]
        },

        'controllers.contracts.updateController': {
            class: 'controllers/Contracts/UpdateController',
            arguments: ['@repositories.contract', '@repositories.user']
        },

        'controllers.contracts.destroyController': {
            class: 'controllers/Contracts/DestroyController',
            arguments: ['@repositories.contract']
        }
    }
};
