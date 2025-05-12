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

        // @TODO Delete createdBy and updatedBy
        // @TODO Before, firstName is ambiguous!
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
                },
                {
                    association: 'createdBy',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    association: 'updatedBy',
                    attributes: ['id', 'firstName', 'lastName']
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
                !user.roles.find(role => role.name === Role.EMPLOYEE)
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
