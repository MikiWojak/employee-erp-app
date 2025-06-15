'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Suggestion extends Model {
        static associate({ User }) {
            this.belongsTo(User, {
                as: 'user',
                foreignKey: 'userId'
            });
        }

        static get SEARCHABLE_FIELDS() {
            return [
                'title',
                'description',
                '$user.firstName$',
                '$user.lastName$'
            ];
        }
    }

    Suggestion.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            userId: {
                allowNull: false,
                type: DataTypes.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            title: {
                allowNull: false,
                type: DataTypes.STRING
            },
            description: {
                allowNull: false,
                type: DataTypes.TEXT
            }
        },
        {
            modelName: 'Suggestion',
            sequelize,
            timestamps: true,
            paranoid: true
        }
    );

    return Suggestion;
};
