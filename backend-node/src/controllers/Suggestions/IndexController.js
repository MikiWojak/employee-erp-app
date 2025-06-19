class IndexController {
    constructor(suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    async invoke(req, res) {
        const { search, sorting, pagination, loggedUser } = req;

        const { count, rows } = await this.suggestionRepository.findAndCountAll(
            {
                where: search,
                ...sorting,
                ...pagination,
                include: [
                    {
                        association: 'user',
                        required: true
                    },
                    {
                        association: 'usersVoted',
                        attributes: ['id'],
                        through: {
                            attributes: ['suggestionId', 'userId', 'vote']
                        },
                        where: {
                            id: loggedUser.id
                        },
                        required: false
                    }
                ]
            }
        );

        return res.send({ count, rows });
    }
}

module.exports = IndexController;
