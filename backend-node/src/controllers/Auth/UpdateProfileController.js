const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateProfileController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            file,
            loggedUser: { id },
            body: { firstName, lastName, dateOfBirth, email }
        } = req;

        console.dir(
            { firstName, lastName, dateOfBirth, email, file },
            { depth: null }
        );

        const user = await this.userRepository.getById(id);

        if (!user) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        const data = {
            firstName,
            lastName,
            dateOfBirth,
            email
        };

        if (file && Object.keys(file).length) {
            const [, ...avatarUrlParts] = file.path.split('/');
            const avatarUrl = avatarUrlParts.join('/');

            data.avatarUrl = avatarUrl;
        }

        await user.update(data);

        const updatedUser = await this.userRepository.getById(id);

        return res.send(updatedUser);
    }
}

module.exports = UpdateProfileController;
