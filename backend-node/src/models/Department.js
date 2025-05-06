'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Department extends Model {
        static get SEARCHABLE_FIELDS() {
            return ['name'];
        }
    }

    Department.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING
            }
        },
        {
            modelName: 'Department',
            sequelize,
            timestamps: true,
            paranoid: true
        }
    );

    return Department;
};
