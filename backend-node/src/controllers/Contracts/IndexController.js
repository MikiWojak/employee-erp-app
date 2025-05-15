const deepmerge = require('deepmerge');

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
            query: { mineOnly }
        } = req;

        const mineOnlyFlag = mineOnly === 'true';

        console.log({ mineOnly, mineOnlyFlag });

        const isAdmin = await loggedUser.isAdmin();
        const isManager = await loggedUser.isManager();

        let where = search;

        const baseOptions = {
            where,
            ...sorting,
            ...pagination
        };

        let options = {};

        if (isAdmin) {
            options = {
                ...baseOptions,
                include: [
                    {
                        association: 'user',
                        required: true
                    }
                ]
            };
        } else if (isManager && !mineOnlyFlag) {
            options = {
                ...baseOptions,
                include: [
                    {
                        association: 'user',
                        required: true,
                        where: {
                            departmentId: loggedUser.departmentId
                        },
                        include: [
                            {
                                association: 'roles',
                                through: {
                                    attributes: []
                                },
                                required: true,
                                where: { name: [Role.EMPLOYEE] }
                            }
                        ]
                    }
                ]
            };
        } else {
            options = {
                ...baseOptions,
                where: {
                    ...search,
                    userId: loggedUser.id
                }
            };
        }

        const contracts =
            await this.contractRepository.findAndCountAll(options);

        return res.send(contracts);
    }
}

module.exports = IndexController;
