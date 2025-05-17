const { Op, Sequelize } = require('sequelize');

module.exports = (fields = []) => {
    return async (request, response, next) => {
        const {
            query: { q = '' }
        } = request;

        const where = {};

        if (q) {
            const fieldIncludesQueryString = {
                [Op.like]: `%${q}%`
            };

            where[Op.or] = fields.map(field =>
                typeof field === 'object'
                    ? Sequelize.where(field, fieldIncludesQueryString)
                    : {
                          [field]: fieldIncludesQueryString
                      }
            );
        }

        request.search = where;

        return next();
    };
};
