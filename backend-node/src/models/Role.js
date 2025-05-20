'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate({ User }) {
            this.hasMany(User, { foreignKey: 'roleId' });
        }

        static get ADMIN() {
            return 'admin';
        }

        static get MANAGER() {
            return 'manager';
        }

        static get EMPLOYEE() {
            return 'employee';
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

    return Role;
};
