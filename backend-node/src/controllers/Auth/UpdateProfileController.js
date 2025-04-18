const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateProfileController {
    constructor(userRepository, storeMediaHandler, deleteMediaHandler) {
        this.userRepository = userRepository;
        this.storeMediaHandler = storeMediaHandler;
        this.deleteMediaHandler = deleteMediaHandler;
    }

    async invoke(req, res) {
        const {
            file,
            loggedUser: { id },
            body: { firstName, lastName, dateOfBirth, email, avatar }
        } = req;

        console.dir(
            { firstName, lastName, dateOfBirth, email, avatar, file },
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
        const oldAvatarId = user.avatar?.id || null;

        await user.update(data);

        if (file) {
            const newAvatar = await this.storeMediaHandler.handle(file);

            await user.setAvatar(newAvatar);
        }

        await user.reload();

        if (!file && !avatar?.id) {
            await user.setAvatar(null);
        }

        if (!avatar?.id || user.avatarId !== oldAvatarId) {
            await this.deleteMediaHandler.handle(oldAvatarId);
        }

        const updatedUser = await this.userRepository.getById(id);

        return res.send(updatedUser);
    }
}

module.exports = UpdateProfileController;
