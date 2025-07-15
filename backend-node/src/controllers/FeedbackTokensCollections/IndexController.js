class IndexController {
    constructor(feedbackTokensCollectionRepository) {
        this.feedbackTokensCollectionRepository =
            feedbackTokensCollectionRepository;
    }

    async invoke(req, res) {
        const {
            search,
            sorting,
            pagination,
            rolesInfo: { isManager }
        } = req;

        const { count, rows } =
            await this.feedbackTokensCollectionRepository.findAndCountAll({
                where: search,
                ...sorting,
                ...pagination,
                ...(isManager && {
                    attributes: { exclude: ['usersPermitted', 'usersFilled'] }
                })
            });

        return res.send({ count, rows });
    }
}

module.exports = IndexController;
