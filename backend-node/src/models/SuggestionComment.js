'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SuggestionComment extends Model {
        static associate({ User }) {
            this.belongsTo(User, {
                as: 'user',
                foreignKey: 'userId'
            });
        }
    }

    SuggestionComment.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            suggestionId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'Suggestions',
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
            content: {
                allowNull: false,
                type: DataTypes.TEXT
            }
        },
        {
            modelName: 'SuggestionComment',
            sequelize,
            timestamps: true,
            paranoid: true
        }
    );

    return SuggestionComment;
};
