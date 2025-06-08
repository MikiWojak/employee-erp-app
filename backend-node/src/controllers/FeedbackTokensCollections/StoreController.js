const dayjs = require('dayjs');

const { Role } = require('../../models');
const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
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
            await this.feedbackTokensCollectionRepository.getDbTransaction();

        try {
            const [, , tokenCollection, users] = await Promise.all([
                this.feedbackTokensCollectionRepository.update(
                    { expiresAt: dateTime },
                    { where: { expiresAt: null }, transaction }
                ),
                this.feedbackTokenRepository.update(
                    { expired: true },
                    { where: { expired: false }, transaction }
                ),
                this.feedbackTokensCollectionRepository.create(
                    { dateTime },
                    { transaction }
                ),
                this.userRepository.findAll({
                    attributes: ['id'],
                    include: [
                        {
                            association: 'role',
                            attributes: [],
                            required: true,
                            where: { name: [Role.EMPLOYEE, Role.MANAGER] }
                        }
                    ]
                })
            ]);

            // @TODO Consider Savepoint

            for (const user of users) {
                await this.feedbackTokenRepository.create(
                    {
                        userId: user.id,
                        feedbackTokensCollectionId: tokenCollection.id
                    },
                    {
                        transaction
                    }
                );
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        return res.sendStatus(HTTP.CREATED);
    }
}

module.exports = StoreController;
