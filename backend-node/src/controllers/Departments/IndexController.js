const { literal } = require('sequelize');

const { Role } = require('../../models');

class IndexController {
    constructor(departmentRepository, roleRepository) {
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
    }

    async invoke(req, res) {
        const { search: where, sorting, pagination } = req;

        const [roleManager, roleEmployee] = await Promise.all([
            this.roleRepository.findByName(Role.MANAGER),
            this.roleRepository.findByName(Role.EMPLOYEE)
        ]);

        const options = {
            attributes: {
                include: [
                    [
                        literal(
                            `(SELECT COUNT(\`Users\`.\`id\`) FROM \`Users\` WHERE \`deletedAt\` IS NULL AND \`Users\`.\`departmentId\` = \`Department\`.\`id\` AND \`Users\`.\`roleId\` = '${roleEmployee.id}')`
                        ),
                        'employeesCount'
                    ],
                    [
                        literal(
                            `(SELECT COUNT(\`Users\`.\`id\`) FROM \`Users\` WHERE \`deletedAt\` IS NULL AND \`Users\`.\`departmentId\` = \`Department\`.\`id\` AND \`Users\`.\`roleId\` = '${roleManager.id}')`
                        ),
                        'managersCount'
                    ]
                ]
            },
            where,
            ...sorting,
            ...pagination
        };

        const [count, rows] = await Promise.all([
            this.departmentRepository.count({ where }),
            this.departmentRepository.findAll(options)
        ]);

        return res.send({ count, rows });
    }
}

module.exports = IndexController;
