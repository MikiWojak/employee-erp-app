'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'Contracts',
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
                position: {
                    allowNull: false,
                    type: Sequelize.STRING
                },
                startDate: {
                    allowNull: false,
                    type: Sequelize.DATEONLY
                },
                endDate: {
                    allowNull: false,
                    type: Sequelize.DATEONLY
                },
                vacationDaysPerYear: {
                    allowNull: false,
                    type: Sequelize.INTEGER
                },
                vacationDays: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    defaultValue: 0
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
        await queryInterface.dropTable('Contracts');
    }
};
