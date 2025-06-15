const { StatusCodes: HTTP } = require('http-status-codes');

// @TODO Remove comments
class VoteController {
    constructor(suggestionRepository, suggestionVote2UserRepository) {
        this.suggestionRepository = suggestionRepository;
        this.suggestionVote2UserRepository = suggestionVote2UserRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            body: { vote },
            params: { id }
        } = req;

        const suggestion = await this.suggestionRepository.findById(id);

        if (!suggestion) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        if (suggestion.userId === loggedUser.id) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send('You cannot vote on your own suggestion.');
        }

        const data = {
            suggestionId: id,
            userId: loggedUser.id
        };

        // Find existing vote item
        const suggestionVote2User =
            await this.suggestionVote2UserRepository.getByPK(data);

        // Check if same vote
        const sameVote = vote === suggestionVote2User?.vote;

        // If exists and same - END!
        if (suggestionVote2User && sameVote) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        const transaction = await this.suggestionRepository.getDbTransaction();

        try {
            // If exist and item different
            // - decrease stats
            if (suggestionVote2User && !sameVote) {
                const revertOptions =
                    suggestionVote2User.vote === 1
                        ? { votesUp: 1 }
                        : { votesDown: 1 };

                await this.suggestionVote2UserRepository.decrement(
                    revertOptions,
                    { transaction }
                );
            }

            const increaseOptions =
                vote === 1 ? { votesUp: 1 } : { votesDown: 1 };

            // Add or edit stat item
            await this.suggestionVote2UserRepository.createOrUpdate(
                { ...data, vote },
                { transaction }
            );

            await suggestion.increment(increaseOptions, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = VoteController;
