module.exports = {
    services: {
        'controllers.vacations.index': {
            class: 'controllers/Vacations/IndexController',
            arguments: ['@repositories.vacation']
        },

        'controllers.vacations.store': {
            class: 'controllers/Vacations/StoreController',
            arguments: ['@repositories.vacation', '@repositories.user']
        },

        'controllers.vacations.update': {
            class: 'controllers/Vacations/UpdateController',
            arguments: ['@repositories.vacation', '@repositories.user']
        },

        'controllers.vacations.destroy': {
            class: 'controllers/Vacations/DestroyController',
            arguments: ['@repositories.vacation']
        }
    }
};
