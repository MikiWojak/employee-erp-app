const { Role } = require('../../models');
const { StatusCodes: HTTP } = require('http-status-codes');

class StoreController {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    async invoke(req, res) {
        const {
            body: { firstName, lastName, dateOfBirth, email, password }
        } = req;

        const { id: roleId } = await this.roleRepository.findByName(
            Role.EMPLOYEE
        );

        const { id } = await this.userRepository.create({
            roleId,
            firstName,
            lastName,
            dateOfBirth,
            email,
            password
        });

        const user = await this.userRepository.getById(id);

        return res.status(HTTP.CREATED).send(user);
    }
}

module.exports = StoreController;
