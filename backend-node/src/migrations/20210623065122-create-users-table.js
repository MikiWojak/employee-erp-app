'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'Users',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4
                },
                roleId: {
                    allowNull: false,
                    type: Sequelize.UUID,
                    references: {
                        model: 'Roles',
                        key: 'id'
                    }
                },
                firstName: {
                    allowNull: false,
                    type: Sequelize.STRING
                },
                lastName: {
                    allowNull: false,
                    type: Sequelize.STRING
                },
                dateOfBirth: {
                    allowNull: false,
                    type: Sequelize.DATEONLY
                },
                email: {
                    allowNull: false,
                    unique: true,
                    type: Sequelize.STRING
                },
                password: {
                    allowNull: false,
                    type: Sequelize.STRING
                },
                vacationDaysSum: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                },
                vacationDaysUsed: {
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
        await queryInterface.dropTable('Users');
    }
};
