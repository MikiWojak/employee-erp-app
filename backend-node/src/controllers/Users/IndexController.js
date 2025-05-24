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
            query: { allRoles },
            rolesInfo: { isAdmin, isManager }
        } = req;

        const allRolesFlag = allRoles === 'true';

        let where = search;
        const roleNames = [
            Role.EMPLOYEE,
            ...(allRolesFlag ? [Role.MANAGER] : [])
        ];

        if (isManager) {
            where = deepmerge(where, {
                departmentId: loggedUser.departmentId
            });
        }

        if (isAdmin) {
            roleNames.push(allRolesFlag ? Role.ADMIN : Role.MANAGER);
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
                user.role.name === Role.MANAGER
            ) {
                user.dateOfBirth = null;

                return user;
            }

            return user;
        });

        return res.send({ count, rows });
    }
}

module.exports = IndexController;
