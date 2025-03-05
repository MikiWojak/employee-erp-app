const { Op } = require('sequelize');
const deepmerge = require('deepmerge');
const { isPlainObject } = require('is-plain-object');

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

        // @TODO Keep types on merge!!!
        // @TODO Do I still need deepmerge?
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
            : deepmerge(
                  baseOptions,
                  {
                      where: {
                          ...search,
                          userId: loggedUser.id
                      }
                  },
                  {
                      isMergeableObject: isPlainObject
                  }
              );

        console.dir({ options }, { depth: null });

        const contracts =
            await this.contractRepository.findAndCountAll(options);

        return res.send(contracts);
    }
}

module.exports = IndexController;
