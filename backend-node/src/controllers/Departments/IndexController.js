class IndexController {
    constructor(departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    async invoke(req, res) {
        const { search, sorting, pagination } = req;

        const options = {
            where: search,
            ...sorting,
            ...pagination
        };

        const departments =
            await this.departmentRepository.findAndCountAll(options);

        return res.send(departments);
    }
}

module.exports = IndexController;
