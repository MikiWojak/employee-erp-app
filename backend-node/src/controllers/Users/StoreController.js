const { StatusCodes: HTTP } = require('http-status-codes');

const { Role } = require('../../models');

class StoreController {
    constructor(
        userRepository,
        roleRepository,
        sendEmailHandler,
        getPasswordSetLinkHandler
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.sendEmailHandler = sendEmailHandler;
        this.getPasswordSetLinkHandler = getPasswordSetLinkHandler;
    }

    async invoke(req, res) {
        const {
            body: { firstName, lastName, dateOfBirth, email }
        } = req;

        const roleEmployee = await this.roleRepository.findByName(
            Role.EMPLOYEE
        );

        const transaction = await this.userRepository.getDbTransaction();

        let createdUser = null;

        try {
            createdUser = await this.userRepository.create(
                {
                    firstName,
                    lastName,
                    dateOfBirth,
                    email
                },
                { transaction }
            );

            await createdUser.setRoles([roleEmployee], { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        if (!createdUser) {
            return res.sendStatus(HTTP.INTERNAL_SERVER_ERROR);
        }

        const user = await this.userRepository.getById(createdUser.id);

        const setPasswordLink = await this.getPasswordSetLinkHandler.handle(
            user.id
        );

        await this.sendEmailHandler.handle('UserStore', email, {
            firstName: user.firstName,
            setPasswordLink
        });

        return res.status(HTTP.CREATED).send(user);
    }
}

module.exports = StoreController;
