const { StatusCodes: HTTP } = require('http-status-codes');

class DestroyController {
    constructor(suggestionRepository, suggestionCommentRepository) {
        this.suggestionRepository = suggestionRepository;
        this.suggestionCommentRepository = suggestionCommentRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id }
        } = req;

        const suggestionComment =
            await this.suggestionCommentRepository.findById(id, {
                include: [
                    {
                        association: 'suggestion',
                        required: true
                    }
                ]
            });

        if (!suggestionComment) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        if (suggestionComment.userId !== loggedUser.id) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        const { STATUS_PENDING } = this.suggestionRepository.model;

        if (suggestionComment.suggestion.status === STATUS_PENDING) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send('You cannot delete comment for pending suggestion.');
        }

        await suggestionComment.destroy();

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = DestroyController;
