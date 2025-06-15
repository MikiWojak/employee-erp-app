'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable(
            'Suggestions',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                userId: {
                    allowNull: false,
                    type: DataTypes.UUID,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },
                title: {
                    allowNull: false,
                    type: DataTypes.STRING
                },
                description: {
                    allowNull: false,
                    type: DataTypes.TEXT
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
        await queryInterface.dropTable('Suggestions');
    }
};
