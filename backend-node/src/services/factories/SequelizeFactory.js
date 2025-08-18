'use strict';

const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const crypto = require('crypto');

class SequelizeFactory {
    static create(Sequelize, config) {
        const hooks = {
            beforeUpdate: item => {
                if ('updatedAt' in item) {
                    item.updatedAt = dayjs().format();
                }
            }
        };

        const {
            db: databaseConfig,
            db: { name, username, password }
        } = config;

        const sequelize = new Sequelize(name, username, password, {
            ...databaseConfig,
            hooks
        });

        const id = crypto.randomBytes(8).toString('hex');
        console.info(`Sequelize instance #${id}`);

        const databaseComponents = {};
        const modelsLocation = path.join(__dirname, '../../models');

        const modelFileNamesRaw = fs.readdirSync(modelsLocation);
        const modelFileNames = modelFileNamesRaw.filter(
            fileName =>
                fileName.indexOf('.') !== 0 &&
                fileName !== 'index.js' &&
                fileName.slice(-3) === '.js'
        );

        for (const fileName of modelFileNames) {
            const model = require(path.join(modelsLocation, fileName))(
                sequelize,
                Sequelize.DataTypes
            );
            databaseComponents[model.name] = model;
        }

        for (const modelName of Object.keys(databaseComponents)) {
            if (databaseComponents[modelName].associate) {
                databaseComponents[modelName].associate(databaseComponents);
            }
        }

        databaseComponents.sequelize = sequelize;
        databaseComponents.Sequelize = Sequelize;

        return databaseComponents;
    }
}

module.exports = SequelizeFactory;
