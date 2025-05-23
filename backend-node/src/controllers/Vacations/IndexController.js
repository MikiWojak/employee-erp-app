const { Op } = require('sequelize');

const { Role } = require('../../models');

class IndexController {
    constructor(vacationRepository) {
        this.vacationRepository = vacationRepository;
    }

    async invoke(req, res) {
        const {
            search,
            sorting,
            pagination,
            loggedUser,
            query: { mineOnly },
            rolesInfo: { isAdmin, isManager, isEmployee }
        } = req;

        const mineOnlyVal = mineOnly === 'true';

        const managerEmployeesFlag = isManager && !mineOnlyVal;
        const mineOnlyFlag = isEmployee || mineOnlyVal;

        const roleNames =
            isAdmin || mineOnlyFlag
                ? [Role.MANAGER, Role.EMPLOYEE]
                : Role.EMPLOYEE;

        const options = {
            where: {
                ...search,
                ...(mineOnlyFlag
                    ? { userId: loggedUser.id }
                    : {
                          userId: {
                              [Op.not]: loggedUser.id
                          }
                      })
            },
            ...sorting,
            ...pagination,
            include: [
                {
                    association: 'user',
                    required: true,
                    ...(managerEmployeesFlag && {
                        where: {
                            departmentId: loggedUser.departmentId
                        }
                    }),
                    include: [
                        {
                            association: 'role',
                            required: true,
                            where: { name: roleNames }
                        }
                    ]
                }
            ],
            subQuery: false
        };

        const vacations =
            await this.vacationRepository.findAndCountAll(options);

        return res.send(vacations);
    }
}

module.exports = IndexController;
