const { Role } = require('../../models');

class IndexController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const { search, sorting, pagination } = req;

        const options = {
            where: search,
            ...sorting,
            ...pagination,
            include: [
                {
                    association: 'role',
                    required: true,
                    where: { name: Role.EMPLOYEE }
                }
            ]
        };

        const users = await this.userRepository.findAndCountAll(options);

        return res.send(users);
    }
}

module.exports = IndexController;
