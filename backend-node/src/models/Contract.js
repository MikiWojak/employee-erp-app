'use strict';
const { Model } = require('sequelize');
const dayjs = require('dayjs');

module.exports = (sequelize, DataTypes) => {
    class Contract extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId'
            });
        }
    }

    Contract.init(
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
                type: DataTypes.INTEGER
            }
        },
        {
            modelName: 'Contract',
            sequelize,
            timestamps: true,
            paranoid: true,

            hooks: {
                async beforeSave(contract, options) {
                    const startDate = dayjs(contract.startDate);
                    const endDate = dayjs(contract.endDate);

                    const duration = endDate.diff(startDate, 'day') + 1;
                    const multiplier = duration / 365;

                    const vacationDays = Math.round(
                        contract.vacationDaysPerYear * multiplier
                    );

                    contract.vacationDays = vacationDays;
                }
            }
        }
    );

    return Contract;
};
