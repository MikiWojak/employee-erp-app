class IndexController {
    constructor(suggestionCommentRepository) {
        this.suggestionCommentRepository = suggestionCommentRepository;
    }

    async invoke(req, res) {
        const {
            pagination,
            params: { id: suggestionId }
        } = req;

        const suggestions =
            await this.suggestionCommentRepository.findAndCountAll({
                where: {
                    suggestionId
                },
                ...pagination,
                include: [
                    {
                        association: 'user',
                        required: false
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

        return res.send(suggestions);
    }
}

module.exports = IndexController;
