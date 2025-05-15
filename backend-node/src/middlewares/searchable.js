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
