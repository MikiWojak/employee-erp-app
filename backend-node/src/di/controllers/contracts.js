module.exports = {
    services: {
        'controllers.contracts.index': {
            class: 'controllers/Contracts/IndexController',
            arguments: ['@repositories.contract']
        },

        'controllers.contracts.store': {
            class: 'controllers/Contracts/StoreController',
            arguments: ['@repositories.contract', '@repositories.user']
        },

        'controllers.contracts.update': {
            class: 'controllers/Contracts/UpdateController',
            arguments: ['@repositories.contract', '@repositories.user']
        },

        'controllers.contracts.destroy': {
            class: 'controllers/Contracts/DestroyController',
            arguments: ['@repositories.contract']
        }
    }
};
