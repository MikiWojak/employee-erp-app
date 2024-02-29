'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'Roles',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4
                },
                name: {
                    allowNull: false,
                    type: Sequelize.STRING
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.fn('now')
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.fn('now')
                },
                deletedAt: {
                    type: Sequelize.DATE,
                    defaultValue: null
                }
            },
            {
                charset,
                collate
            }
        );
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Roles');
    }
};
