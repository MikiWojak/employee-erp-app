'use strict';

const { Model } = require('sequelize');

const ADMIN = 'admin';
const EMPLOYEE = 'employee';

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate({ User }) {
            this.belongsToMany(User, {
                as: 'users',
                through: 'Role2User',
                foreignKey: 'roleId'
            });
        }
    }

    Role.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING
            }
        },
        {
            modelName: 'Role',
            sequelize,
            timestamps: true,
            paranoid: true
        }
    );

    Role.ADMIN = ADMIN;
    Role.EMPLOYEE = EMPLOYEE;

    return Role;
};
