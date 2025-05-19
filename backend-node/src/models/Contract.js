'use strict';

const dayjs = require('dayjs');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Contract extends Model {
        static associate({ User }) {
            this.belongsTo(User, {
                as: 'user',
                foreignKey: 'userId'
            });
            this.belongsTo(User, {
                as: 'createdBy',
                foreignKey: 'createdById'
            });
            this.belongsTo(User, {
                as: 'updatedBy',
                foreignKey: 'updatedById'
            });
        }

        static get SEARCHABLE_FIELDS() {
            return [
                'position',
                'vacationDaysPerYear',
                'vacationDays',
                '$user.firstName$',
                '$user.lastName$'
            ];
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
