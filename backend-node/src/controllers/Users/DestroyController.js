const dayjs = require('dayjs');
const { StatusCodes: HTTP } = require('http-status-codes');

class DestroyController {
    constructor(userRepository, sendEmailHandler) {
        this.userRepository = userRepository;
        this.sendEmailHandler = sendEmailHandler;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id },
            rolesInfo: { isManager }
        } = req;

        const user = await this.userRepository.findById(id);

        if (!user) {
            return res.sendStatus(HTTP.NO_CONTENT);
        }

        if (loggedUser.id === user.id) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send('You cannot delete your own account.');
        }

        if (isManager) {
            if (user.departmentId !== loggedUser.departmentId) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send(
                        'Manager can delete user from the same department only.'
                    );
            }

            const userRolesInfo = await user.rolesInfo();

            if (!userRolesInfo.isEmployee) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send('Manager can delete employee only.');
            }
        }

        const { firstName: userFirstName, email: userEmail } = user;
        const transaction = await this.userRepository.getDbTransaction();

        try {
            const timestamp = dayjs().unix();
            const email = `${user.email}_${timestamp}`;

            await user.update(
                { email, updatedById: loggedUser.id },
                { transaction }
            );
            await user.destroy({ transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        await this.sendEmailHandler.handle('UserDestroy', userEmail, {
            firstName: userFirstName
        });

        return res.sendStatus(HTTP.NO_CONTENT);
    }
}

module.exports = DestroyController;
