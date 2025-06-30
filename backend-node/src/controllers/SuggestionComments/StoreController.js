const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(suggestionRepository, suggestionCommentRepository) {
        this.suggestionRepository = suggestionRepository;
        this.suggestionCommentRepository = suggestionCommentRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            body: { content },
            params: { id: suggestionId }
        } = req;

        const suggestion =
            await this.suggestionRepository.findById(suggestionId);

        if (!suggestion) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        const { STATUS_PENDING } = this.suggestionRepository.model;

        if (suggestion.status === STATUS_PENDING) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send('You cannot comment pending suggestion.');
        }

        const data = {
            suggestionId,
            userId: loggedUser.id,
            content
        };

        const suggestionComment =
            await this.suggestionCommentRepository.create(data);

        return res.status(HTTP.CREATED).send(suggestionComment);
    }
}

module.exports = StoreController;
