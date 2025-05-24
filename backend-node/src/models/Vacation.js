'use strict';

const dayjs = require('dayjs');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Vacation extends Model {
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
                'duration',
                '$user.firstName$',
                '$user.lastName$',
                '$createdBy.firstName$',
                '$createdBy.lastName$',
                '$updatedBy.firstName$',
                '$updatedBy.lastName$'
            ];
        }
    }

    Vacation.init(
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
            startDate: {
                allowNull: false,
                type: DataTypes.DATEONLY
            },
            endDate: {
                allowNull: false,
                type: DataTypes.DATEONLY
            },
            duration: {
                type: DataTypes.INTEGER
            },
            approved: {
                allowNull: false,
                type: DataTypes.BOOLEAN
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
            }
        },
        {
            modelName: 'Vacation',
            sequelize,
            timestamps: true,
            paranoid: true,

            hooks: {
                beforeSave(vacation, options) {
                    let startDate = dayjs(vacation.startDate);
                    let endDate = dayjs(vacation.endDate);

                    let duration = 0;

                    while (startDate <= endDate) {
                        if (startDate.day() !== 0 && startDate.day() !== 6) {
                            duration++;
                        }

                        startDate = startDate.add(1, 'day');
                    }

                    vacation.duration = duration;
                }
            }
        }
    );

    return Vacation;
};
