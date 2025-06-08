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
            expired: {
                allowNull: false,
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            modelName: 'FeedbackToken',
            sequelize,
            timestamps: true,
            updatedAt: false
        }
    );

    return FeedbackToken;
};
