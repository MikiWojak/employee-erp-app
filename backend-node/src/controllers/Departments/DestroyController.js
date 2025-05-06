const dayjs = require('dayjs');
const { StatusCodes: HTTP } = require('http-status-codes');

class DestroyController {
    constructor(departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    async invoke(req, res) {
        const {
            params: { id }
        } = req;

        const department = await this.departmentRepository.findById(id);

        if (!department) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        const transaction = await this.departmentRepository.getDbTransaction();

        try {
            const timestamp = dayjs().unix();
            const name = `${department.name}_${timestamp}`;

            await department.update({ name }, { transaction });
            await department.destroy({ transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = DestroyController;
