const { Op } = require('sequelize');

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

            where[Op.or] = fields.map(field => ({
                [field]: fieldIncludesQueryString
            }));
        }

        request.search = where;

        return next();
    };
};
