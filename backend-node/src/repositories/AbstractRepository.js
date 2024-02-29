class AbstractRepository {
    constructor(db) {
        this.db = db;
    }

    find(where, options = {}) {
        return typeof where === 'object'
            ? this.findOne(where, options)
            : this.findById(where, options);
    }

    findById(id, options = {}) {
        if (options.where) {
            options.where.id = id;
        }

        return this.model.findOne({
            where: {
                id
            },
            ...options
        });
    }

    findOne(options = {}) {
        return this.model.findOne(options);
    }

    findAll(options = {}) {
        return this.model.findAll(options);
    }

    findAndCountAll(options = {}) {
        return this.model.findAndCountAll(options);
    }

    count(options = {}) {
        return this.model.count(options);
    }

    updateById(id, data) {
        return this.model.update(data, {
            where: {
                id
            }
        });
    }

    delete(options = {}) {
        return this.model.destroy(options);
    }

    update(data, options = {}) {
        return this.model.update(data, options);
    }

    create(data, options) {
        return this.model.create(data, options);
    }

    build(data, options) {
        return this.model.build(data, options);
    }

    bulkCreate(items = []) {
        return this.model.bulkCreate(items);
    }

    getDbTransaction() {
        return this.db.sequelize.transaction();
    }

    async sum(field, options) {
        const sum = await this.model.sum(field, options);

        return sum || 0;
    }
}

module.exports = AbstractRepository;
