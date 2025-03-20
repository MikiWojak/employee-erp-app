class IndexController {
    constructor(vacationRepository) {
        this.vacationRepository = vacationRepository;
    }

    async invoke(req, res) {
        const { search, sorting, pagination, loggedUser } = req;

        const isAdmin = await loggedUser.isAdmin();

        const baseOptions = {
            where: search,
            ...sorting,
            ...pagination
        };

        const options = isAdmin
            ? {
                  ...baseOptions,
                  include: [
                      {
                          association: 'user',
                          required: true
                      }
                  ]
              }
            : {
                  ...baseOptions,
                  where: {
                      ...search,
                      userId: loggedUser.id
                  }
              };

        const vacations =
            await this.vacationRepository.findAndCountAll(options);

        return res.send(vacations);
    }
}

module.exports = IndexController;
