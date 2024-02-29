module.exports = {
    services: {
        'controllers.vacations.indexController': {
            class: 'controllers/Vacations/IndexController',
            arguments: ['@repositories.vacation']
        },

        'controllers.vacations.storeController': {
            class: 'controllers/Vacations/StoreController',
            arguments: ['@repositories.vacation', '@repositories.user']
        },

        'controllers.vacations.updateController': {
            class: 'controllers/Vacations/UpdateController',
            arguments: ['@repositories.vacation', '@repositories.user']
        },

        'controllers.vacations.destroyController': {
            class: 'controllers/Vacations/DestroyController',
            arguments: ['@repositories.vacation']
        }
    }
};
