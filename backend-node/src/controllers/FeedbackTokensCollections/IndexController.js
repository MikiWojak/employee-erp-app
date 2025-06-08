class IndexController {
    constructor(feedbackTokensCollectionRepository) {
        this.feedbackTokensCollectionRepository =
            feedbackTokensCollectionRepository;
    }

    async invoke(req, res) {
        // @TODO Consider showing stats

        const { sorting, pagination } = req;

        const { count, rows } =
            await this.feedbackTokensCollectionRepository.findAndCountAll({
                ...sorting,
                ...pagination
            });

        return res.send({ count, rows });
    }
}

module.exports = IndexController;
