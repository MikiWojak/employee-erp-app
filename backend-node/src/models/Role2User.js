'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role2User extends Model {
        static associate({ Role, User }) {
            this.belongsTo(Role, {
                as: 'role',
                foreignKey: 'roleId'
            });
            this.belongsTo(User, {
                as: 'user',
                foreignKey: 'userId'
            });
        }
    }

    Role2User.init(
        {
            roleId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                references: {
                    model: 'Roles',
                    key: 'id'
                }
            },
            userId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            }
        },
        {
            modelName: 'Role2User',
            tableName: 'Role2User',
            sequelize,
            timestamps: true,
            updatedAt: false
        }
    );

    return Role2User;
};
