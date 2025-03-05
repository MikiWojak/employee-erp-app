const { Op, Sequelize } = require('sequelize');

module.exports = (fields = []) => {
    return (request, response, next) => {
        const { q = '' } = request.query;

        const where = {};

        if (q) {
            const fieldIncludesQueryString = {
                [Op.like]: `%${q}%`
            };

            where[Op.or] = fields.map(field =>
                Sequelize.where(
                    typeof field === 'string' ? Sequelize.col(field) : field,
                    fieldIncludesQueryString
                )
            );
        }

        request.search = where;

        return next();
    };
};
