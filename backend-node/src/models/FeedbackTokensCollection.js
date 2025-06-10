'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FeedbackTokensCollection extends Model {}

    FeedbackTokensCollection.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            dateTime: {
                allowNull: false,
                type: DataTypes.DATE
            },
            expiresAt: {
                allowNull: true,
                defaultValue: null,
                type: DataTypes.DATE
            },
            usersPermitted: {
                allowNull: false,
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            usersFilled: {
                allowNull: false,
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        },
        {
            modelName: 'FeedbackTokensCollection',
            sequelize,
            timestamps: true
        }
    );

    return FeedbackTokensCollection;
};
