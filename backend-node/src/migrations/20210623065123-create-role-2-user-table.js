'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable(
            'Role2User',
            {
                roleId: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataTypes.UUID,
                    references: {
                        model: 'Roles',
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
        await queryInterface.dropTable('Role2User');
    }
};
