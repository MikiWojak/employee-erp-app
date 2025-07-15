'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable(
            'SuggestionComments',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                suggestionId: {
                    allowNull: false,
                    type: DataTypes.UUID,
                    references: {
                        model: 'Suggestions',
                        key: 'id'
                    }
                },
                userId: {
                    allowNull: false,
                    type: DataTypes.UUID,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },
                content: {
                    allowNull: false,
                    type: DataTypes.TEXT
                },
                edited: {
                    allowNull: false,
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
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
        await queryInterface.dropTable('SuggestionComments');
    }
};
