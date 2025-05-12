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
            body: {
                firstName,
                lastName,
                role,
                departmentId,
                dateOfBirth,
                email
            },
            loggedUser
        } = req;

        const isAdmin = await loggedUser.isAdmin();

        const data = {
            firstName,
            lastName,
            dateOfBirth,
            email,
            createdById: loggedUser.id,
            updatedById: loggedUser.id
        };

        if (isAdmin) {
            data.departmentId = role === Role.ADMIN ? null : departmentId;
        } else {
            data.departmentId = loggedUser.departmentId;
        }

        let createdUser = null;
        const roleName = isAdmin ? role : Role.EMPLOYEE;
        const roleObject = await this.roleRepository.findByName(roleName);

        const transaction = await this.userRepository.getDbTransaction();

        try {
            createdUser = await this.userRepository.create(data, {
                transaction
            });

            await createdUser.setRoles([roleObject], { transaction });

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
