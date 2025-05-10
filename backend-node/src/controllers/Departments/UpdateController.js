const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateController {
    constructor(departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    async invoke(req, res) {
        const {
            params: { id },
            body: { name }
        } = req;

        const department = await this.departmentRepository.findById(id);

        if (!department) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        await department.update({ name });

        const updatedDepartment = await this.departmentRepository.findById(id);

        return res.send(updatedDepartment);
    }
}

module.exports = UpdateController;
