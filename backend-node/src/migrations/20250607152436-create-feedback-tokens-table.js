'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable(
            'FeedbackTokens',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                feedbackTokensCollectionId: {
                    allowNull: false,
                    type: DataTypes.UUID,
                    references: {
                        model: 'FeedbackTokensCollections',
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
                expired: {
                    allowNull: false,
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                },
                createdAt: {
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
        await queryInterface.dropTable('FeedbackTokens');
    }
};
