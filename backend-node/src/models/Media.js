'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Media extends Model {}

    Media.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            filename: {
                allowNull: false,
                type: DataTypes.STRING
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING
            },
            altName: {
                allowNull: false,
                type: DataTypes.STRING
            },
            extension: {
                allowNull: false,
                type: DataTypes.ENUM('png', 'jpg', 'jpeg')
            },
            type: {
                allowNull: false,
                type: DataTypes.ENUM('image')
            },
            date: {
                allowNull: false,
                type: DataTypes.STRING
            },
            size: {
                allowNull: false,
                type: DataTypes.INTEGER
            }
        },
        {
            modelName: 'Media',
            tableName: 'Media',
            sequelize,
            timestamps: true
        }
    );

    return Media;
};
