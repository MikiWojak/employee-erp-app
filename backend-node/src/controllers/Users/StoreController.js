const { StatusCodes: HTTP } = require('http-status-codes');

const { Role } = require('../../models');

class StoreController {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    async invoke(req, res) {
        const {
            body: { firstName, lastName, dateOfBirth, email, password }
        } = req;

        const roleEmployee = await this.roleRepository.findByName(
            Role.EMPLOYEE
        );

        const createdUser = await this.userRepository.create({
            firstName,
            lastName,
            dateOfBirth,
            email,
            password
        });

        await createdUser.setRoles([roleEmployee]);

        const user = await this.userRepository.getById(createdUser.id);

        return res.status(HTTP.CREATED).send(user);
    }
}

module.exports = StoreController;
