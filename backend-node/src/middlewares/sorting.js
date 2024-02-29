const { col } = require('sequelize');

module.exports = (defaultSortBy = ['createdAt:DESC']) => {
    return (request, response, next) => {
        let { sortBy = defaultSortBy } = request.query;

        const orderItems = sortBy.map(orderItem => {
            const [key, order] = orderItem.split(':');

            return [col(key), order];
        });

        request.sorting = {
            order: orderItems
        };

        return next();
    };
};
