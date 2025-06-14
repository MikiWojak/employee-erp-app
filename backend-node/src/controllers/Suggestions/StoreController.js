const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    async invoke(req, res) {
        const {
            body: { title, description }
        } = req;

        const data = {
            title,
            description
        };

        const suggestion = await this.suggestionRepository.create(data);

        return res.status(HTTP.CREATED).send(suggestion);
    }
}

module.exports = StoreController;
