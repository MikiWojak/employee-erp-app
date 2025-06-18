'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SuggestionVote2User extends Model {}

    SuggestionVote2User.init(
        {
            suggestionId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                references: {
                    model: 'Suggestions',
                    key: 'id'
                }
            },
            userId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            vote: {
                allowNull: false,
                type: DataTypes.INTEGER
            }
        },
        {
            modelName: 'SuggestionVote2User',
            tableName: 'SuggestionVote2User',
            sequelize,
            timestamps: true
        }
    );

    return SuggestionVote2User;
};
