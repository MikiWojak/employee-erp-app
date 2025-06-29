const { StatusCodes: HTTP } = require('http-status-codes');

class DestroyController {
    constructor(suggestionCommentRepository) {
        this.suggestionCommentRepository = suggestionCommentRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id }
        } = req;

        const suggestionComment =
            await this.suggestionCommentRepository.findById(id);

        if (!suggestionComment) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        if (suggestionComment.userId !== loggedUser.id) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        // @TODO Block for suggestion with specific statuses

        await suggestionComment.destroy();

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = DestroyController;
