const deepmerge = require('deepmerge');

const AbstractRepository = require('./AbstractRepository');

class RoleRepository extends AbstractRepository {
    get model() {
        return this.db.Role;
    }

    findByName(name, options = {}) {
        const args = deepmerge(options, { where: { name } });

        return this.model.findOne(args);
    }
}

module.exports = RoleRepository;
