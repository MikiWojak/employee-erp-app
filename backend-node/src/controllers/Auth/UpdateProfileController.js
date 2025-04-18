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
            body: { firstName, lastName, dateOfBirth, email, avatarId }
        } = req;

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

        if (!file && !avatarId) {
            await user.setAvatar(null);
        }

        // @TODO Check avatar after change and reload

        // Remove file if existed already (including case when file does not exist - simply leave)
        if (!avatarId || user.avatarId !== oldAvatarId) {
            await this.deleteMediaHandler.handle(oldAvatarId);
        }

        const updatedUser = await this.userRepository.getById(id);

        return res.send(updatedUser);
    }
}

module.exports = UpdateProfileController;
