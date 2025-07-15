const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            body: { title, description }
        } = req;

        const data = {
            userId: loggedUser.id,
            title,
            description
        };

        const suggestion = await this.suggestionRepository.create(data);

        return res.status(HTTP.CREATED).send(suggestion);
    }
}

module.exports = StoreController;
