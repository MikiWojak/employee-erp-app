const { Role } = require('../../models');
const deepmerge = require('deepmerge');

class IndexController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async invoke(req, res) {
        const { search, sorting, pagination, loggedUser } = req;

        const isAdmin = await loggedUser.isAdmin();
        const isManager = await loggedUser.isManager();

        let where = search;
        const roleNames = [Role.EMPLOYEE, Role.MANAGER];

        if (isManager) {
            where = deepmerge(where, {
                departmentId: loggedUser.departmentId
            });
        }

        if (isAdmin) {
            roleNames.push(Role.ADMIN);
        }

        const options = {
            where,
            ...sorting,
            ...pagination,
            include: [
                {
                    association: 'roles',
                    through: {
                        attributes: []
                    },
                    required: true,
                    where: { name: roleNames }
                },
                {
                    association: 'avatar'
                },
                {
                    association: 'department'
                }
            ],
            subQuery: false
        };

        const users = await this.userRepository.findAndCountAll(options);

        return res.send(users);
    }
}

module.exports = IndexController;
