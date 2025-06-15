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

        console.log({ id, suggestion, msg: 'Destroy Suggestion - prepare' });

        if (!suggestion) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        if (suggestion.userId !== loggedUser.id) {
            return res.sendStatus(HTTP.FORBIDDEN);
        }

        console.log({ msg: 'Destroy Suggestion' });

        await suggestion.destroy();

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = DestroyController;
