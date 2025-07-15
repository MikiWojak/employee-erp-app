const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateController {
    constructor(suggestionRepository, suggestionCommentRepository) {
        this.suggestionRepository = suggestionRepository;
        this.suggestionCommentRepository = suggestionCommentRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id },
            body: { content }
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
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        if (suggestionComment.userId !== loggedUser.id) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        const { STATUS_PENDING } = this.suggestionRepository.model;

        if (suggestionComment.suggestion.status === STATUS_PENDING) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send('You cannot edit comment for pending suggestion.');
        }

        const data = {
            content,
            edited: true
        };

        await suggestionComment.update(data);

        const updatedSuggestion = this.suggestionCommentRepository.findById(id);

        return res.send(updatedSuggestion);
    }
}

module.exports = UpdateController;
