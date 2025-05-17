const deepmerge = require('deepmerge');

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
            loggedUser,
            rolesInfo: { isAdmin, isManager }
        } = req;

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
                    association: 'role',
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
                user.role.name === Role.MANAGER
            ) {
                delete user.dateOfBirth;

                return user;
            }

            return user;
        });

        return res.send({ count, rows });
    }
}

module.exports = IndexController;
