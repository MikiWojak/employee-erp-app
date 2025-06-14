const dayjs = require('dayjs');

const { Role } = require('../../models');

class GenerateTokenCollectionHandler {
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

    async handle(dateTime, options = {}) {
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


        const tokenCollection =
            await this.feedbackTokensCollectionRepository.create(
                { dateTime, usersPermitted: users.length },
                options
            );

        for (const user of users) {
            await this.feedbackTokenRepository.create(
                {
                    userId: user.id,
                    feedbackTokensCollectionId: tokenCollection.id
                },
                options
            );
        }
    }
}

module.exports = GenerateTokenCollectionHandler;
