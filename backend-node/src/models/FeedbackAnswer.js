'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FeedbackAnswer extends Model {
        static associate({ FeedbackQuestion }) {
            this.belongsTo(FeedbackQuestion, {
                as: 'question',
                foreignKey: 'questionId'
            });
        }
    }

    FeedbackAnswer.init(
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
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'Departments',
                    key: 'id'
                }
            },
            questionId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'FeedbackQuestions',
                    key: 'id'
                }
            },
            answer: {
                allowNull: false,
                type: DataTypes.STRING
            }
        },
        {
            modelName: 'FeedbackAnswer',
            sequelize,
            timestamps: true,
            paranoid: true
        }
    );

    return FeedbackAnswer;
};
