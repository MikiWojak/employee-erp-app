const { Role } = require('../../models');

class IndexController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const {
            search,
            sorting,
            pagination,
            query: { fetchAll }
        } = req;

        const fetchAllFlag = fetchAll === 'true';

        let options = {
            where: search,
            ...sorting,
            include: [
                {
                    association: 'role',
                    required: true,
                    where: { name: Role.EMPLOYEE }
                }
            ]
        };

        if (!fetchAllFlag) {
            options = { ...options, ...pagination };
        }

        const users = await this.userRepository.findAndCountAll(options);

        return res.send(users);
    }
}

module.exports = IndexController;
