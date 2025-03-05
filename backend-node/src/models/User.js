'use strict';
const bcrypt = require('bcrypt');
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const { Role } = sequelize.models;

    class User extends Model {
        static associate(models) {
            this.belongsTo(models.Role, { as: 'role', foreignKey: 'roleId' });
            this.hasMany(models.Contract, {
                as: 'contracts',
                foreignKey: 'userId'
            });
            this.hasMany(models.Vacation, {
                as: 'vacations',
                foreignKey: 'userId'
            });
        }

        async isAdmin() {
            const role = await this.getRole();

            return role.name === Role.ADMIN;
        }

        static get SEARCHABLE_FIELDS() {
            return [
                'firstName',
                'lastName',
                'email',
                Sequelize.literal("CONCAT(firstName, ' ', lastName)")
            ];
        }
    }

    User.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            roleId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'Roles',
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
            fullName: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${this.firstName} ${this.lastName}`;
                }
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
                allowNull: false,
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
            }
        },
        {
            modelName: 'User',
            sequelize,
            timestamps: true,
            paranoid: true,

            defaultScope: {
                attributes: { exclude: ['password'] }
            },

            hooks: {
                async beforeSave(user, options) {
                    if (options.fields && options.fields.includes('password')) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                }
            }
        }
    );

    return User;
};
