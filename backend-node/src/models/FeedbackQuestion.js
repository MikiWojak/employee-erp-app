'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FeedbackQuestion extends Model {}

    FeedbackQuestion.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            title: {
                allowNull: false,
                type: DataTypes.STRING
            },
            answerOptions: {
                allowNull: false,
                type: DataTypes.JSON,
                default: []
            },
            order: {
                allowNull: false,
                type: DataTypes.INTEGER
            }
        },
        {
            modelName: 'FeedbackQuestion',
            sequelize,
            timestamps: true,
            paranoid: true
        }
    );

    return FeedbackQuestion;
};
