const { Op } = require('sequelize');
const { StatusCodes: HTTP } = require('http-status-codes');

class ShowController {
    constructor(suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    async invoke(req, res) {
        const {
            loggedUser,
            params: { id },
            rolesInfo: { isAdmin }
        } = req;

        const { STATUS_PENDING } = this.suggestionRepository.model;

        let where = {};

        if (!isAdmin) {
            where = {
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
            };
        }

        const suggestion = await this.suggestionRepository.findById(id, {
            where,
            include: [
                {
                    association: 'user',
                    required: true,
                    include: [
                        {
                            association: 'avatar'
                        }
                    ]
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
        });

        if (!suggestion) {
            return res.sendStatus(HTTP.NOT_FOUND);
        }

        return res.send(suggestion);
    }
}

module.exports = ShowController;
