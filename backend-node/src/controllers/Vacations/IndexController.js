class IndexController {
    constructor(vacationRepository) {
        this.vacationRepository = vacationRepository;
    }

    async invoke(req, res) {
        const {
            sorting,
            pagination,
            loggedUser,
            query: { fetchAll }
        } = req;

        const fetchAllFlag = fetchAll === 'true';
        const isAdmin = await loggedUser.isAdmin();

        let options = {
            ...sorting
        };

        if (!fetchAllFlag) {
            options = { ...options, ...pagination };
        }

        if (isAdmin) {
            options = {
                ...options,
                include: [
                    {
                        association: 'user',
                        required: true
                    }
                ]
            };
        } else {
            options = {
                ...options,
                where: {
                    userId: loggedUser.id
                }
            };
        }

        const vacations =
            await this.vacationRepository.findAndCountAll(options);

        return res.send(vacations);
    }
}

module.exports = IndexController;
