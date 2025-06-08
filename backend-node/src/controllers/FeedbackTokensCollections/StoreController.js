const dayjs = require('dayjs');

const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(
        feedbackTokensCollectionRepository,
        generateTokenCollectionHandler
    ) {
        this.feedbackTokensCollectionRepository =
            feedbackTokensCollectionRepository;
        this.generateTokenCollectionHandler = generateTokenCollectionHandler;
    }

    async invoke(req, res) {
        const dateTime = dayjs().format();

        const transaction =
            await this.feedbackTokensCollectionRepository.getDbTransaction();

        try {
            await this.feedbackTokensCollectionRepository.update(
                { expiresAt: dayjs().format() },
                { where: { expiresAt: null }, transaction }
            );

            await this.generateTokenCollectionHandler.handle(dateTime, {
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

module.exports = StoreController;
