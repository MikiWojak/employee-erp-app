const { StatusCodes: HTTP } = require('http-status-codes');

class DestroyController {
    constructor(suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id }
        } = req;

        const suggestion = await this.suggestionRepository.findById(id);

        if (!suggestion) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        if (suggestion.userId !== loggedUser.id) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        const { STATUS_PENDING } = this.suggestionRepository.model;

        if (suggestion.status !== STATUS_PENDING) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send('Only pending suggestion can be deleted.');
        }

        await suggestion.destroy();

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = DestroyController;
