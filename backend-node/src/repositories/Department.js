const AbstractRepository = require('./AbstractRepository');
const deepmerge = require('deepmerge');

class DepartmentRepository extends AbstractRepository {
    get model() {
        return this.db.Department;
    }

    findByName(name, options = {}) {
        const args = deepmerge(options, { where: { name } });

        return this.model.findOne(args);
    }
}

module.exports = DepartmentRepository;
