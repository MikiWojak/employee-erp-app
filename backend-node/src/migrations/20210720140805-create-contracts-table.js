'use strict';

const {
    db: {
        define: { charset, collate }
    }
} = require('../config');

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable(
            'Contracts',
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
                position: {
                    allowNull: false,
                    type: DataTypes.STRING
                },
                startDate: {
                    allowNull: false,
                    type: DataTypes.DATEONLY
                },
                endDate: {
                    allowNull: false,
                    type: DataTypes.DATEONLY
                },
                vacationDaysPerYear: {
                    allowNull: false,
                    type: DataTypes.INTEGER
                },
                vacationDays: {
                    allowNull: false,
                    type: DataTypes.INTEGER,
                    defaultValue: 0
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
        await queryInterface.dropTable('Contracts');
    }
};
