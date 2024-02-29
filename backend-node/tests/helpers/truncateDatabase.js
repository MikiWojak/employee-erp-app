const di = require('../../src/di');
const { sequelize } = di.get('sequelize');

module.exports = async () => {
    const models = Object.keys(sequelize.models);

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const model of models) {
        await sequelize.models[model].truncate({ force: true });
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
};
