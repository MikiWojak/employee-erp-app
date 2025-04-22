'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable(
            'Media',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                filename: {
                    allowNull: false,
                    type: DataTypes.STRING
                },
                name: {
                    allowNull: false,
                    type: DataTypes.STRING
                },
                altName: {
                    allowNull: false,
                    type: DataTypes.STRING
                },
                extension: {
                    allowNull: false,
                    type: DataTypes.ENUM('png', 'jpg', 'jpeg')
                },
                type: {
                    allowNull: false,
                    type: DataTypes.ENUM('image', 'other')
                },
                date: {
                    allowNull: false,
                    type: DataTypes.STRING
                },
                size: {
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
        await queryInterface.dropTable('Media');
    }
};
