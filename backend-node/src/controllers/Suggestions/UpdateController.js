const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateController {
    constructor(suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id },
            body: { title, description }
        } = req;

        const suggestion = await this.suggestionRepository.findById(id);

        if (!suggestion) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        if (suggestion.userId !== loggedUser.id) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        const data = {
            title,
            description
        };

        await suggestion.update(data);

        const updatedSuggestion = this.suggestionRepository.findById(id);

        return res.send(updatedSuggestion);
    }
}

module.exports = UpdateController;
