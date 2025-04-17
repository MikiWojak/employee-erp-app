const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateProfileController {
    constructor(userRepository, storeMediaHandler) {
        this.userRepository = userRepository;
        this.storeMediaHandler = storeMediaHandler;
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

        const avatar = await this.storeMediaHandler.handle(file);

        const data = {
            firstName,
            lastName,
            dateOfBirth,
            email
        };

        await user.update(data);
        await user.setAvatar(avatar);

        const updatedUser = await this.userRepository.getById(id);

        return res.send(updatedUser);
    }
}

module.exports = UpdateProfileController;
