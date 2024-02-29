const { StatusCodes: HTTP } = require('http-status-codes');

class MeController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser: { id }
        } = req;

        const user = await this.userRepository.getById(id);

        if (!user) {
            return res.sendStatus(HTTP.UNAUTHORIZED);
        }

        return res.send(user);
    }
}

module.exports = MeController;
