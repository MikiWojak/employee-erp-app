const dayjs = require('dayjs');
const { StatusCodes: HTTP } = require('http-status-codes');

class DestroyController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            params: { id }
        } = req;

        const user = await this.userRepository.findById(id);

        if (!user) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        const transaction = await this.userRepository.getDbTransaction();

        try {
            const timestamp = dayjs().unix();
            const email = `${user.email}_${timestamp}`;

            await user.update({ email }, { transaction });
            await user.destroy({ transaction });

            await transaction.commit();

            return res.sendStatus(HTTP.NO_CONTENT);
        } catch (error) {
            await transaction.rollback();

            throw error;
        }
    }
}

module.exports = DestroyController;
