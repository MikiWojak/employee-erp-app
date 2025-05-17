const { StatusCodes: HTTP } = require('http-status-codes');

const { Role } = require('../../models');

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

        const user = await this.userRepository.getById(id);

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
                return res.sendStatus(HTTP.FORBIDDEN);
            }

            const userRolesInfo = await user.rolesInfo();

            if (userRolesInfo.isManager) {
                return res.sendStatus(HTTP.FORBIDDEN);
            }
        }

        const data = {
            firstName,
            lastName,
            dateOfBirth,
            email,
            updatedById: loggedUser.id
        };

        if (isAdmin) {
            data.departmentId = role === Role.ADMIN ? null : departmentId;
        }

        const roleName = isAdmin ? role : Role.EMPLOYEE;
        const roleObject = await this.roleRepository.findByName(roleName);

        const transaction = await this.userRepository.getDbTransaction();

        try {
            await user.update(data, {
                transaction
            });

            await user.setRole(roleObject, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }

        const updatedUser = await this.userRepository.getById(id);

        return res.send(updatedUser);
    }
}

module.exports = UpdateController;
