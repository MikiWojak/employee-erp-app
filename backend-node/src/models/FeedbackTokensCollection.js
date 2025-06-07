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
