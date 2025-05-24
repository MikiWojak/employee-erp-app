const { StatusCodes: HTTP } = require('http-status-codes');

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
            loggedUser,
            rolesInfo: { isAdmin }
        } = req;
        const { ADMIN, EMPLOYEE } = this.roleRepository.model;

        const roleName = isAdmin ? role : EMPLOYEE;
        const roleObject = await this.roleRepository.findByName(roleName);

        const data = {
            roleId: roleObject.id,
            firstName,
            lastName,
            dateOfBirth,
            email,
            createdById: loggedUser.id,
            updatedById: loggedUser.id
        };

        if (isAdmin) {
            data.departmentId = role === ADMIN ? null : departmentId;
        } else {
            data.departmentId = loggedUser.departmentId;
        }

        const createdUser = await this.userRepository.create(data);

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
