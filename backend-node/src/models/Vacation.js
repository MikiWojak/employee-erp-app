'use strict';

const { Model } = require('sequelize');
const dayjs = require('dayjs');

module.exports = (sequelize, DataTypes) => {
    class Vacation extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId'
            });
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
