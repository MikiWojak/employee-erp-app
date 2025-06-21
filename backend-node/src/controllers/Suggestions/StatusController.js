const { StatusCodes: HTTP } = require('http-status-codes');

class StatusController {
    constructor(suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    async invoke(req, res) {
        const {
            params: { id },
            body: { status }
        } = req;

        const suggestion = await this.suggestionRepository.findById(id);

        if (!suggestion) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        await suggestion.update({ status });

        const updatedSuggestion = await this.suggestionRepository.findById(id);

        return res.send(updatedSuggestion);
    }
}

module.exports = StatusController;
