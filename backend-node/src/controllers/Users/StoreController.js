const { StatusCodes: HTTP } = require('http-status-codes');

const { Role } = require('../../models');

class StoreController {
    constructor(userRepository, roleRepository, mailer) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.mailer = mailer;
    }

    async invoke(req, res) {
        const {
            body: { firstName, lastName, dateOfBirth, email, password }
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
                    email,
                    password
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

        await this.mailer.send({
            to: email,
            subject: 'Welcome',
            template: 'user_store',
            context: {
                fullName: `${user.firstName} ${user.lastName}`
            }
        });

        return res.status(HTTP.CREATED).send(user);
    }
}

module.exports = StoreController;
