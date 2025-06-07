const dayjs = require('dayjs');

const { Role } = require('../../models');
const { StatusCodes: HTTP } = require('http-status-codes');

class IndexController {
    constructor(
        feedbackTokensCollectionRepository,
        feedbackTokenRepository,
        userRepository
    ) {
        this.feedbackTokensCollectionRepository =
            feedbackTokensCollectionRepository;
        this.feedbackTokenRepository = feedbackTokenRepository;
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const dateTime = dayjs().format();

        const transaction =
            await this.feedbackTokensCollectionRepository.transaction();

        try {
            // @TODO Cancel previous ones!

            const tokenCollection =
                await this.feedbackTokensCollectionRepository.create(
                    { dateTime },
                    { transaction }
                );

            const users = await this.userRepository.findAll({
                attributes: ['id'],
                include: [
                    {
                        association: 'role',
                        attributes: [],
                        required: true,
                        where: { name: [Role.EMPLOYEE, Role.MANAGER] }
                    }
                ]
            });

            const tokenItems = users.map(user => ({
                userId: user.id,
                feedbackTokensCollectionId: tokenCollection.id
            }));

            await this.feedbackTokenRepository.bulkCreate(tokenItems, {
                transaction
            });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        return res.sendStatus(HTTP.CREATED);
    }
}

module.exports = IndexController;
