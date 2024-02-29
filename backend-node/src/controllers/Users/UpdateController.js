const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            params: { id },
            body: { firstName, lastName, dateOfBirth, email }
        } = req;

        const user = await this.userRepository.getById(id);

        if (!user) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        await user.update({
            firstName,
            lastName,
            dateOfBirth,
            email
        });

        const updatedUser = await this.userRepository.getById(id);

        return res.send(updatedUser);
    }
}

module.exports = UpdateController;
