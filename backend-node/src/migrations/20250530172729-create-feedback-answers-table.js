'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable(
            'FeedbackAnswers',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                roleId: {
                    allowNull: false,
                    type: DataTypes.UUID,
                    references: {
                        model: 'Roles',
                        key: 'id'
                    }
                },
                departmentId: {
                    allowNull: false,
                    type: DataTypes.UUID,
                    references: {
                        model: 'Departments',
                        key: 'id'
                    }
                },
                questionId: {
                    allowNull: false,
                    type: DataTypes.UUID,
                    references: {
                        model: 'FeedbackQuestions',
                        key: 'id'
                    }
                },
                answer: {
                    allowNull: false,
                    type: DataTypes.STRING
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
        await queryInterface.dropTable('FeedbackAnswers');
    }
};
