module.exports = {
    services: {
        'repositories.role': {
            class: 'repositories/Role',
            arguments: ['@sequelize']
        },

        'repositories.department': {
            class: 'repositories/Department',
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
        },

        'repositories.media': {
            class: 'repositories/Media',
            arguments: ['@sequelize']
        },

        'repositories.feedbackAnswer': {
            class: 'repositories/FeedbackAnswer',
            arguments: ['@sequelize']
        },

        'repositories.feedbackQuestion': {
            class: 'repositories/FeedbackQuestion',
            arguments: ['@sequelize']
        },

        'repositories.feedbackTokensCollection': {
            class: 'repositories/FeedbackTokensCollection',
            arguments: ['@sequelize']
        },

        'repositories.feedbackToken': {
            class: 'repositories/FeedbackToken',
            arguments: ['@sequelize']
        }
    }
};
