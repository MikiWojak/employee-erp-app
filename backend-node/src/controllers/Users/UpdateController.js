const { StatusCodes: HTTP } = require('http-status-codes');

class UpdateController {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
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
            params: { id },
            rolesInfo: { isAdmin, isManager }
        } = req;
        const { ADMIN, EMPLOYEE } = this.roleRepository.model;

        const user = await this.userRepository.getById(id);

        // console.dir({ user }, { depth: null });

        if (!user) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        if (loggedUser.id === user.id) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send('You cannot edit yourself here. Go to profile page.');
        }

        if (isManager) {
            if (user.departmentId !== loggedUser.departmentId) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send(
                        'Manager can edit user from the same department only.'
                    );
            }

            const userRolesInfo = await user.rolesInfo();

            if (!userRolesInfo.isEmployee) {
                return res
                    .status(HTTP.UNPROCESSABLE_ENTITY)
                    .send('Manager can edit employee only.');
            }
        }

        const roleName = isAdmin ? role : EMPLOYEE;
        const roleObject = await this.roleRepository.findByName(roleName);

        const data = {
            roleId: roleObject.id,
            firstName,
            lastName,
            dateOfBirth,
            email,
            updatedById: loggedUser.id
        };

        if (isAdmin) {
            data.departmentId = role === ADMIN ? null : departmentId;
        }

        await user.update(data);

        const updatedUser = await this.userRepository.getById(id);

        return res.send(updatedUser);
    }
}

module.exports = UpdateController;
