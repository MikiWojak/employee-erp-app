class IndexController {
    constructor(feedbackTokensCollectionRepository) {
        this.feedbackTokensCollectionRepository =
            feedbackTokensCollectionRepository;
    }

    async invoke(req, res) {
        const { search, sorting, pagination } = req;

        const { count, rows } =
            await this.feedbackTokensCollectionRepository.findAndCountAll({
                where: search,
                ...sorting,
                ...pagination
            });

        return res.send({ count, rows });
    }
}

module.exports = IndexController;
