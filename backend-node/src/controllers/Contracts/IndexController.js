const { Role } = require('../../models');

const { Op } = require('sequelize');

class IndexController {
    constructor(contractRepository) {
        this.contractRepository = contractRepository;
    }

    async invoke(req, res) {
        const {
            sorting,
            pagination,
            loggedUser,
            search,
            query: { mineOnly }
        } = req;

        const mineOnlyVal = mineOnly === 'true';

        const isAdmin = await loggedUser.isAdmin();
        const isManager = await loggedUser.isManager();
        const isEmployee = await loggedUser.isEmployee();

        const managerEmployeesFlag = isManager && !mineOnlyVal;
        const mineOnlyFlag = isEmployee || mineOnlyVal;

        const roleNames = [Role.EMPLOYEE];

        const where = {
            ...search,
            // ...(managerEmployeesFlag && {
            //     userId: {
            //         [Op.not]: loggedUser.id
            //     }
            // }),
            ...(mineOnlyFlag && { userId: loggedUser.id })
        };

        const includeUserRoleItem = {
            association: 'roles',
            through: {
                attributes: []
            },
            required: true,
            where: { name: [Role.MANAGER, Role.EMPLOYEE] }
        };

        const includeUserItem = {
            association: 'user',
            required: true,
            ...(managerEmployeesFlag && {
                where: {
                    departmentId: loggedUser.departmentId
                }
            })
        };

        // @TODO Get IDs first

        const [count, rows] = await Promise.all([
            this.contractRepository.count({
                where,
                include: [
                    {
                        ...includeUserItem,
                        attributes: [],
                        include: [
                            {
                                ...includeUserRoleItem,
                                attributes: []
                            }
                        ]
                    }
                ],
                distinct: true
            }),
            this.contractRepository.findAll({
                where,
                ...sorting,
                ...pagination,
                include: [
                    {
                        ...includeUserItem,
                        include: [includeUserRoleItem]
                    }
                ],
                subQuery: false
            })
        ]);

        return res.send({ count, rows });
    }
}

module.exports = IndexController;
