module.exports = {
    services: {
        'controllers.departments.index': {
            class: 'controllers/Departments/IndexController',
            arguments: ['@repositories.department']
        },

        'controllers.departments.store': {
            class: 'controllers/Departments/StoreController',
            arguments: ['@repositories.department']
        },

        'controllers.departments.update': {
            class: 'controllers/Departments/UpdateController',
            arguments: ['@repositories.department']
        },

        'controllers.departments.destroy': {
            class: 'controllers/Departments/DestroyController',
            arguments: ['@repositories.department']
        }
    }
};
