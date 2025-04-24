'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PasswordReset extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId'
            });
        }
    }

    PasswordReset.init(
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
            token: {
                allowNull: false,
                type: DataTypes.STRING
            },
            expiresAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        },
        {
            modelName: 'PasswordReset',
            sequelize,
            timestamps: true
        }
    );

    return PasswordReset;
};
