const { Op } = require('sequelize');

const { Role } = require('../../models');

class IndexController {
    constructor(contractRepository) {
        this.contractRepository = contractRepository;
    }

    async invoke(req, res) {
        const {
            search,
            sorting,
            pagination,
            loggedUser,
            query: { mineOnly },
            rolesInfo: { isManager, isEmployee }
        } = req;

        const mineOnlyVal = mineOnly === 'true';

        const managerEmployeesFlag = isManager && !mineOnlyVal;
        const mineOnlyFlag = isEmployee || mineOnlyVal;

        const where = {
            ...search,
            ...(managerEmployeesFlag && {
                userId: {
                    [Op.not]: loggedUser.id
                }
            }),
            ...(mineOnlyFlag && { userId: loggedUser.id })
        };

        const includeUserRoleItem = {
            association: 'role',
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

        const contracts = await this.contractRepository.findAndCountAll({
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
        });

        return res.send(contracts);
    }
}

module.exports = IndexController;
