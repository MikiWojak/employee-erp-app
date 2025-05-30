'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable(
            'FeedbackQuestions',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                title: {
                    allowNull: false,
                    type: DataTypes.STRING
                },
                answerOptions: {
                    allowNull: false,
                    type: DataTypes.JSON,
                    default: []
                },
                createdAt: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.fn('now')
                },
                updatedAt: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.fn('now')
                },
                deletedAt: {
                    type: DataTypes.DATE,
                    defaultValue: null
                }
            },
            {
                charset,
                collate
            }
        );
    },
    down: async queryInterface => {
        await queryInterface.dropTable('FeedbackQuestions');
    }
};
