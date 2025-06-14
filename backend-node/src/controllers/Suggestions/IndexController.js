class IndexController {
    constructor(suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    async invoke(req, res) {
        const { search, sorting, pagination } = req;

        const { count, rows } = await this.suggestionRepository.findAndCountAll(
            {
                where: search,
                ...sorting,
                ...pagination
            }
        );

        return res.send({ count, rows });
    }
}

module.exports = IndexController;
