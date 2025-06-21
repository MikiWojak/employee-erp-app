const { Op } = require('sequelize');

class IndexController {
    constructor(suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    async invoke(req, res) {
        const {
            search,
            sorting,
            pagination,
            loggedUser,
            rolesInfo: { isAdmin }
        } = req;

        const { STATUS_PENDING } = this.suggestionRepository.model;

        const whereConditions = [search];

        if (!isAdmin) {
            whereConditions.push({
                [Op.or]: [
                    {
                        status: {
                            [Op.not]: STATUS_PENDING
                        }
                    },
                    {
                        status: STATUS_PENDING,
                        userId: loggedUser.id
                    }
                ]
            });
        }

        const where = {
            [Op.and]: whereConditions
        };

        const { count, rows } = await this.suggestionRepository.findAndCountAll(
            {
                where,
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
