const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    async invoke(req, res) {
        const {
            body: { name }
        } = req;

        const createdDepartment = await this.departmentRepository.create(
            {
                name
            },
            { transaction }
        );

        const deparment = await this.departmentRepository.findById(
            createdDepartment.id
        );

        return res.status(HTTP.CREATED).send(deparment);
    }
}

module.exports = StoreController;
