const { Op, Sequelize } = require('sequelize');

module.exports = (fields = [], isForAdmin = false, adminFields = []) => {
    return async (request, response, next) => {
        const {
            loggedUser,
            query: { q = '' }
        } = request;
        const isAdmin = await loggedUser.isAdmin();

        const where = {};
        const fieldsToProcess = isForAdmin && isAdmin ? adminFields : fields;

        if (q) {
            const fieldIncludesQueryString = {
                [Op.like]: `%${q}%`
            };

            where[Op.or] = fieldsToProcess.map(field =>
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
