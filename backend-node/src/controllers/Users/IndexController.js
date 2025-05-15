const deepmerge = require('deepmerge');

const { Role } = require('../../models');

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

        const { count, rows: rowsRaw } =
            await this.userRepository.findAndCountAll(options);

        const rows = rowsRaw.map(user => {
            if (
                !isAdmin &&
                isManager &&
                user.id !== loggedUser.id &&
                user.roles.find(role => role.name === Role.MANAGER)
            ) {
                user.dateOfBirth = '';

                return user;
            }

            return user;
        });

        return res.send({ count, rows });
    }
}

module.exports = IndexController;
