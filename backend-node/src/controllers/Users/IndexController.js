const dayjs = require('dayjs');
const { Op } = require('sequelize');
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

        const today = dayjs().format('YYYY-MM-DD');

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
                },
                {
                    association: 'contracts',
                    attributes: ['id'],
                    required: false,
                    where: {
                        startDate: {
                            [Op.lte]: today
                        },
                        endDate: {
                            [Op.gte]: today
                        }
                    }
                },
                {
                    association: 'vacations',
                    attributes: ['id'],
                    required: false,
                    where: {
                        startDate: {
                            [Op.lte]: today
                        },
                        endDate: {
                            [Op.gte]: today
                        },
                        approved: true
                    }
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
