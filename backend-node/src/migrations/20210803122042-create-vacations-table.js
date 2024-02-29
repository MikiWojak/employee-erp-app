'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'Vacations',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4
                },
                userId: {
                    allowNull: false,
                    type: Sequelize.UUID,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },
                startDate: {
                    allowNull: false,
                    type: Sequelize.DATEONLY
                },
                endDate: {
                    allowNull: false,
                    type: Sequelize.DATEONLY
                },
                duration: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                },
                approved: {
                    allowNull: false,
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
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
        await queryInterface.dropTable('Vacations');
    }
};
