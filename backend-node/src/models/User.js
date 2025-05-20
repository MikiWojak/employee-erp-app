'use strict';

const bcrypt = require('bcrypt');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const { Role } = sequelize.models;

    class User extends Model {
        static associate({
            Role,
            User,
            Media,
            Contract,
            Vacation,
            Department
        }) {
            this.belongsTo(Role, { as: 'role', foreignKey: 'roleId' });
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
            const role = await this.getRole();

            return {
                isAdmin: role.name === Role.ADMIN,
                isManager: role.name === Role.MANAGER,
                isEmployee: role.name === Role.EMPLOYEE
            };
        }

        static get SEARCHABLE_FIELDS() {
            return ['firstName', 'lastName', 'email', '$department.name$'];
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
