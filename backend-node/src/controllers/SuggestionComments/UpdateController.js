const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateController {
    constructor(suggestionCommentRepository) {
        this.suggestionCommentRepository = suggestionCommentRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id },
            body: { content }
        } = req;

        const suggestionComment =
            await this.suggestionCommentRepository.findById(id);

        if (!suggestionComment) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        if (suggestionComment.userId !== loggedUser.id) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        // @TODO Block for suggestion with specific statuses

        // @TODO Mark as edited

        const data = {
            content
        };

        await suggestionComment.update(data);

        const updatedSuggestion = this.suggestionCommentRepository.findById(id);

        return res.send(updatedSuggestion);
    }
}

module.exports = UpdateController;
