const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    async invoke(req, res) {
        const {
            body: { name }
        } = req;

        const department = await this.departmentRepository.create({
            name
        });

        return res.status(HTTP.CREATED).send(department);
    }
}

module.exports = StoreController;
