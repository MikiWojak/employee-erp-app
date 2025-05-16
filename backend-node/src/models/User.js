'use strict';

const bcrypt = require('bcrypt');
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const { Role } = sequelize.models;

    class User extends Model {
        static associate({
            Role,
            Contract,
            Vacation,
            Media,
            Department,
            User
        }) {
            this.belongsToMany(Role, {
                as: 'roles',
                through: 'Role2User',
                foreignKey: 'userId'
            });
            this.hasMany(Contract, {
                as: 'contracts',
                foreignKey: 'userId'
            });
            this.hasMany(Vacation, {
                as: 'vacations',
                foreignKey: 'userId'
            });
            this.belongsTo(Media, {
                as: 'avatar',
                foreignKey: 'avatarId'
            });
            this.belongsTo(Department, {
                as: 'department',
                foreignKey: 'departmentId'
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

        async rolesInfo() {
            const roles = await this.getRoles();

            return roles.map(role => role.name);
        }

        async isAdmin() {
            const roles = await this.rolesInfo();

            return roles.some(role => role === Role.ADMIN);
        }

        async isManager() {
            const roles = await this.rolesInfo();

            return roles.some(role => role === Role.MANAGER);
        }

        async isEmployee() {
            const roles = await this.rolesInfo();

            return roles.some(role => role === Role.EMPLOYEE);
        }

        static get ADMIN_SEARCHABLE_FIELDS() {
            return [
                'firstName',
                'lastName',
                'email',
                '$department.name$',
                Sequelize.literal("CONCAT(User.firstName, ' ', User.lastName)")
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
            departmentId: {
                allowNull: true,
                defaultValue: null,
                type: DataTypes.UUID,
                references: {
                    model: 'Departments',
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
                allowNull: true,
                defaultValue: null,
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
            },
            avatarId: {
                allowNull: true,
                defaultValue: null,
                type: DataTypes.UUID,
                references: {
                    model: 'Media',
                    key: 'id'
                }
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
            modelName: 'User',
            sequelize,
            timestamps: true,
            paranoid: true,

            defaultScope: {
                attributes: { exclude: ['password'] }
            },

            hooks: {
                beforeCreate: async user => {
                    if (user.password) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                },

                beforeUpdate: async user => {
                    if (user.password) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                }
            }
        }
    );

    return User;
};
