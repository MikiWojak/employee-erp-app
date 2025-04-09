module.exports = {
    services: {
        'repositories.role': {
            class: 'repositories/Role',
            arguments: ['@sequelize']
        },

        'repositories.user': {
            class: 'repositories/User',
            arguments: ['@sequelize']
        },

        'repositories.contract': {
            class: 'repositories/Contract',
            arguments: ['@sequelize']
        },

        'repositories.vacation': {
            class: 'repositories/Vacation',
            arguments: ['@sequelize']
        },

        'repositories.passwordReset': {
            class: 'repositories/PasswordReset',
            arguments: ['@sequelize']
        }
    }
};
