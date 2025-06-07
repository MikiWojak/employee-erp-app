'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FeedbackToken extends Model {}

    FeedbackToken.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            feedbackTokensCollectionId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'FeedbackTokensCollections',
                    key: 'id'
                }
            },
            userId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            expiresAt: {
                allowNull: true,
                defaultValue: null,
                type: DataTypes.DATE
            }
        },
        {
            modelName: 'FeedbackToken',
            sequelize,
            timestamps: true
        }
    );

    return FeedbackToken;
};
