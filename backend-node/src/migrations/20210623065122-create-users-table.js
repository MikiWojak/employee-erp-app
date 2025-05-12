'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable(
            'Users',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                departmentId: {
                    allowNull: true,
                    defaultValue: null,
                    type: DataTypes.UUID,
                    references: {
                        model: 'Departments',
                        key: 'id'
                    }
                },
                firstName: {
                    allowNull: false,
                    type: DataTypes.STRING
                },
                lastName: {
                    allowNull: false,
                    type: DataTypes.STRING
                },
                dateOfBirth: {
                    allowNull: false,
                    type: DataTypes.DATEONLY
                },
                email: {
                    allowNull: false,
                    unique: true,
                    type: DataTypes.STRING
                },
                password: {
                    allowNull: true,
                    defaultValue: null,
                    type: DataTypes.STRING
                },
                vacationDaysSum: {
                    allowNull: false,
                    type: DataTypes.INTEGER,
                    defaultValue: 0
                },
                vacationDaysUsed: {
                    allowNull: false,
                    type: DataTypes.INTEGER,
                    defaultValue: 0
                },
                avatarId: {
                    allowNull: true,
                    defaultValue: null,
                    type: DataTypes.UUID,
                    references: {
                        model: 'Media',
                        key: 'id'
                    }
                },
                createdById: {
                    allowNull: true,
                    type: DataTypes.UUID,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },
                updatedById: {
                    allowNull: true,
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
        await queryInterface.dropTable('Users');
    }
};
