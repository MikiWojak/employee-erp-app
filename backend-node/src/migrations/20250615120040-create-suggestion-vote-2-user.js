'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable(
            'SuggestionVote2User',
            {
                suggestionId: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataTypes.UUID,
                    references: {
                        model: 'Suggestions',
                        key: 'id'
                    }
                },
                userId: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataTypes.UUID,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },
                vote: {
                    allowNull: false,
                    type: DataTypes.INTEGER
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
                }
            },
            {
                charset,
                collate
            }
        );
    },
    down: async queryInterface => {
        await queryInterface.dropTable('SuggestionVote2User');
    }
};
