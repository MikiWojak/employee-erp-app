'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FeedbackTokensCollection extends Model {
        static get SEARCHABLE_FIELDS() {
            return ['number'];
        }
    }

    FeedbackTokensCollection.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            number: {
                allowNull: false,
                type: DataTypes.INTEGER,
                autoIncrement: true,
                unique: true
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
