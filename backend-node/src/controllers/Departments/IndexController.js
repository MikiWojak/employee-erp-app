const { fn, col } = require('sequelize');

class IndexController {
    constructor(departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    async invoke(req, res) {
        const { search: where, sorting, pagination } = req;

        const options = {
            attributes: {
                include: [[fn('COUNT', col('users.id')), 'employeesCount']]
            },
            where,
            ...sorting,
            ...pagination,
            include: [
                {
                    association: 'users',
                    attributes: []
                }
            ],
            group: ['id'],
            distinct: true,
            subQuery: false
        };

        const [count, rows] = await Promise.all([
            this.departmentRepository.count({ where }),
            this.departmentRepository.findAll(options)
        ]);

        return res.send({ count, rows });
    }
}

module.exports = IndexController;
