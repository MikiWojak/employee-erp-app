const { StatusCodes: HTTP } = require('http-status-codes');

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

        const { STATUS_VOTING } = this.suggestionRepository.model;

        if (suggestion.status !== STATUS_VOTING) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send(
                    "You cannot vote on suggestion with status other than 'voting'."
                );
        }

        const data = {
            suggestionId: id,
            userId: loggedUser.id
        };

        const suggestionVote2User =
            await this.suggestionVote2UserRepository.getByPK(data);

        const sameVote = vote === suggestionVote2User?.vote;

        if (suggestionVote2User && sameVote) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        const transaction = await this.suggestionRepository.getDbTransaction();

        try {
            if (suggestionVote2User && !sameVote) {
                const revertOptions =
                    suggestionVote2User.vote === 1
                        ? { votesUp: 1 }
                        : { votesDown: 1 };

                await suggestion.decrement(revertOptions, { transaction });
            }

            const increaseOptions =
                vote === 1 ? { votesUp: 1 } : { votesDown: 1 };

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
