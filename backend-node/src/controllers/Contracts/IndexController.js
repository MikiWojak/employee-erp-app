class IndexController {
    constructor(contractRepository) {
        this.contractRepository = contractRepository;
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

        const contracts =
            await this.contractRepository.findAndCountAll(options);

        return res.send(contracts);
    }
}

module.exports = IndexController;
